'use strict';

var dbm;
var type;
var seed;
var fs = require('fs');
var path = require('path');
var { execSync } = require('child_process');
var Promise;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
  Promise = options.Promise;
};

exports.up = function(db) {
  var compressedFilePath = path.join(__dirname, 'sqls', '20250925175911-load-database-data-up.sql.bz2');
  var sqlFilePath = path.join(__dirname, 'sqls', '20250925175911-load-database-data-up.sql');
  
  return new Promise( function( resolve, reject ) {
    try {
      // Check if compressed file exists
      if (!fs.existsSync(compressedFilePath)) {
        return reject(new Error('Compressed data file not found: ' + compressedFilePath));
      }
      
      // Check if running in CI mode to suppress verbose output
      var isCI = process.env.CI || process.env.NODE_ENV === 'test';
      
      if (!isCI) {
        console.log('🗜️  Decompressing database data (130MB)...');
        console.log('⏱️  This may take a moment...');
      }
      
      // Decompress the file (bunzip2 creates the .sql file)
      execSync(`bunzip2 -k "${compressedFilePath}"`, { cwd: path.dirname(compressedFilePath) });
      
      if (!isCI) {
        console.log('✅ Decompression complete. Loading data...');
      }
      
      // Read the decompressed SQL file
      fs.readFile(sqlFilePath, {encoding: 'utf-8'}, function(err, data){
        if (err) {
          // Clean up decompressed file on error
          if (fs.existsSync(sqlFilePath)) {
            fs.unlinkSync(sqlFilePath);
          }
          return reject(err);
        }
        
        // Check if running in CI mode to suppress verbose output
        var isCI = process.env.CI || process.env.NODE_ENV === 'test';
        if (!isCI) {
          console.log('📊 Executing 37,632 INSERT statements...');
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  })
  .then(function(data) {
    return db.runSql(data);
  })
  .then(function(result) {
    // Clean up decompressed file after successful execution
    var sqlFilePath = path.join(__dirname, 'sqls', '20250925175911-load-database-data-up.sql');
    if (fs.existsSync(sqlFilePath)) {
      fs.unlinkSync(sqlFilePath);
      // Check if running in CI mode to suppress verbose output
      var isCI = process.env.CI || process.env.NODE_ENV === 'test';
      if (!isCI) {
        console.log('🎉 Database data loaded successfully! Temporary file cleaned up.');
      }
    }
    return result;
  })
  .catch(function(error) {
    // Clean up decompressed file on error
    var sqlFilePath = path.join(__dirname, 'sqls', '20250925175911-load-database-data-up.sql');
    if (fs.existsSync(sqlFilePath)) {
      fs.unlinkSync(sqlFilePath);
    }
    throw error;
  });
};

exports.down = function(db) {
  var filePath = path.join(__dirname, 'sqls', '20250925175911-load-database-data-down.sql');
  return new Promise( function( resolve, reject ) {
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (err) return reject(err);
      console.log('received data: ' + data);

      resolve(data);
    });
  })
  .then(function(data) {
    return db.runSql(data);
  });
};

exports._meta = {
  "version": 1
};
