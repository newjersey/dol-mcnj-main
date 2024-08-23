import { Skeleton } from "@material-ui/lab";

export const SkeletonCard = () => {
  return (
    <div data-testid="card" className="card mbs container-fluid pam hover-shadow">
      <div
        className="row mbd"
        style={{
          padding: "0 15px",
        }}
      >
        <Skeleton variant="rect" width="100%" />
      </div>
      <div className="row">
        <div className="col-md-4 col-md-push-8 align-right-when-lg">
          <p className="mts mbxs">
            <Skeleton variant="rect" width="100%" />
          </p>
        </div>
        <div className="col-md-8 col-md-pull-4">
          <p className="mtxs mbz">
            <Skeleton variant="rect" width="50%" />
          </p>
          <p className="mtxs mbz">
            <Skeleton variant="rect" width="50%" />
          </p>
          <p className="mtxs mbz">
            <Skeleton variant="rect" width="50%" />
          </p>
          <p className="mtxs mbz">
            <Skeleton variant="rect" width="50%" />
          </p>
          <p className="mtxs mbz">
            <Skeleton variant="rect" width="100%" />
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="mtxs mbz flex fac fje">
            <Skeleton variant="rect" width="10%" />
          </div>
        </div>
      </div>
    </div>
  );
};
