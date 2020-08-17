# Decision Log

The purpose of this document is to keep track of technical decisions made on this codebase. Given that I
will be handing over this code to another person to maintain in the next few months, this is intended
to provide as much context as possible into why things were decided at the time.

### 2020-08-17

Working on [#174302410](https://www.pivotaltracker.com/story/show/174302410) to group in-demand careers by category.

This story requires going one-by-one through the in-demand SOCs (via some kind of map or something) and 
modifying the SOC to lookup the Major category associated with it, and then building all this together into the
Occupation object to be returned to the frontend.

The decision here is whether to do this work in the Database layer or the Domain layer.

#### Option A

We could stay the course and do logic to create domain objects in the Database layer.  This enforces a separation
of concerns because it decouples our domain logic from the nitty-gritty of how we store our data.

#### Option B

We could shrink our Database layer into mostly doing SQL queries, with little logic to combine things into
complex objects.  Our Domain layer would grow and be responsible for coordinating many SQL queries to build
an object for the frontend.  We would still use join-queries to take advantage of how SQL should be helping us,
we would just build objects on the Domain side.

#### Tradeoffs

The data layer is starting to feel pretty heavy and like it's doing a lot of work.  And testing it
is often pretty heavy, and requires coordinating across multiple test CSVs.  I think one-off cases would be
easier to test if they were handled elsewhere.

Also, for use-cases like this one, where we have a list with an async for-each to go with each item (same as
how search works with highlight), these kinds of things probably should be separate functions in the data layer.

However, going with Option B means creating a whole new set of data transfer objects (or really, moving and
renaming Entities into the domain layer) and I worry it will become a lot of overhead to manage.

#### Decision

Option B.

I think that simple, maintainable code is most important (and easily testable) in the context of someone
else picking up the work.  Splitting responsibilities and making the data layer simpler will improve testing
and also hopefull make it clearer how each object is getting pieced together from data calls.

### 2020-08-13

Working on [#174302410](https://www.pivotaltracker.com/story/show/174302410) to add the list of in-demand
careers.

The data on in-demand SOCs and CIPs came in a spreadsheet that was not designed to be exported into a CSV.
In a previous story ([#173594867](https://www.pivotaltracker.com/story/show/173594867) to show an in-demand tag),
we had to manually do some spreadsheet magic to get a list of in-demand CIPs to save in a table.

Now, we need to also know which SOCs are in-demand.  The issue at hand here is how to add the In-Demand SOC
data into the database.

#### Option A

We could do a bit more spreadsheet magic to get a list of in-demand SOCs, and create a new database table
called `indemandsocs` or something, and insert the data there.

#### Option B

We could do a bit more spreadsheet magic to get a list of in-demand SOCs, and then combine this with the
existing `indemandcips` table (using the crosswalk table) to get a single table holding all the in-demand data.

#### Tradeoffs

Option A is cleaner and simpler, and follows the same pattern we've used so far where we just create a table
directly from a CSV without much change.

Option B consolidates information because why have 2 separate tables holding in-demand information - not
to mention that we also have the `soccipcrosswalk` table that maps between the two. So if anything, all
we really need is the list of in-demand SOCs, and the in-demand CIPs can be programmatically determined using
the crosswalk.

#### Decision

Option A.

It's simpler and cleaner, and less work.  So far, nothing indicates that an extra table will be harder
to maintain, and this is less complexity to get the data into the app.

If it ever becomes an issue to keep in-demand CIPs and in-demand SOCs in different tables, it would
be easy to adjust in the future.  But for now, there's no reason to take on the complexity of combining them.

### 2020-08-12

Working on [#174279670](https://www.pivotaltracker.com/story/show/174279670) to update ETPL data (programs
and providers) to the most recent CSV.

This involves adding migration files to update the "seed" data.  My planned process for this is to delete
all data from these tables (`programs` and `providers` and `programtokens`) and then insert everything
from the new files, instead of attempting a more complicated update transaction.

The issue at hand here is whether to try to make this delete-and-insert undoable.

#### Option A

We could try to make the database perfectly roll-back-able in these migrations by copy-pasting the previous 
version of the data in the "down" file.  This would look like:

up-file:
```sql
delete from programs;
insert into programs ... ([new data]);
```

down-file:
```sql
delete from programs;
insert into programs ... ([old data]);
```

#### Option B

We could treat the database seed as a source of truth, not a migration, despite it being handled by the
migration scripts.  This would mean that the new data insert does not get undone when the database is rolled back.

up-file:
```sql
delete from programs;
insert into programs ... ([new data]);
```

down-file:
```sql
[does nothing]
```

#### Tradeoffs

Option A preserves the exact state of the database, and would therefore be an honest reflection of
seeding as a migration step.

Option B treats the seed separate from the migration, and the new data would not be rolled back if we were
to roll back migrations for a schema change.

The other issue at hand here is the `programtokens` table, which also needs to be deleted and recreated
when the `program` table updates.

If we went with Option A, we would also have to delete and re-create the `programtokens` content at the end
of the down-file - otherwise, the content would be out of sync.  This is fine, but not ideal, because the down-file
would be thousands of lines long full of insert statements, so a future coder looking at it to replicate the 
pattern might not realize it is doing that additional task at the end.

If we went with Option B, however, it would also be better to have the `programtokens` migration code at
the end of the up-file, so that they are in sync with each other.  So the same concern holds true.

If we do Option B, we could separate the changes to `programs` and `programtokens` into two separate migrations, then it's easier
to see what's going on. But that makes them independently roll-back-able (roll back one without the other)
which would put them out of sync.  Separating these into 2 migration files would also make Option A impossible
because of the new data that would be inserted in the programs down-file making `programtokens` out of sync.

#### Decision

Option A.

The biggest concern is `programs` and `programtokens` data being out of sync - this would make the app
unusable. For this reason, making the changes to `programtokens` should happen in the same file as 
the `programs` changes.  If they are in different files, the risk is greater that one would be rolled 
back without the other.

If we are acknowledging that we must have this code at the end of the thousands of lines of inserts, we may
as well go with Option A, and do that in both the up-file and down-file (as opposed to just the up-file).

Since we have seeding as migration, then this preserves the full history, including the old data, on rollback.

Also, in the event that the future ETPL CSV changes structure, and the table needs to add or remove a column
to address this, rolling back data changes as we roll back schema changes would make sense.  Otherwise there
could be a data/schema mismatch.

In order to address the concern about developers not knowing about the `programtokens` change at the end of
the thousands of inserts, I will add a section in the README to address this case specifically.