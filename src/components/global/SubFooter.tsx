import { Twitter, YouTube, Facebook, LinkedIn } from "@components/svgs";
import { myNJ, njoit, opra } from "./assets";
import { ResponsiveImage } from "@components/modules/ResponsiveImage";

export const SubFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div className="sub-footer">
      <div className="container">
        <div className="links">
          <div>
            <a
              href="https://nj.gov/opra/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ResponsiveImage
                src={opra}
                alt="NJ Open Public Records Act"
                width={166}
                height={45}
              />
            </a>
            <a
              href="https://my.state.nj.us/openam/UI/Login"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ResponsiveImage
                src={myNJ}
                alt="myNJ Portal Logo"
                width={165}
                height={38}
              />
            </a>
          </div>
          <div className="socials">
            <ul className="unstyled">
              <li>
                <a
                  className="twitter"
                  href="https://twitter.com/NJGov"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter />
                  <span className="sr-only">Twitter</span>
                </a>
              </li>
              <li>
                <a
                  className="facebook"
                  href="https://www.facebook.com/NJGov"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook />
                  <span className="sr-only">Facebook</span>
                </a>
              </li>
              <li>
                <a
                  className="youtube"
                  href="https://www.youtube.com/user/NewJerseyGovernment"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <YouTube />
                  <span className="sr-only">YouTube</span>
                </a>
              </li>
              <li>
                <a
                  className="linkedin"
                  href="https://www.linkedin.com/company/state-of-new-jersey/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <LinkedIn />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </li>
            </ul>
            <p>Copyright &copy; State of New Jersey, 1996-{year}</p>
          </div>
        </div>
        <div className="powered-link">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://nj.gov/it/"
          >
            <ResponsiveImage
              src={njoit}
              alt="NJ Office of Information Technology"
              width={157}
              height={26}
            />
          </a>
        </div>
      </div>
    </div>
  );
};
