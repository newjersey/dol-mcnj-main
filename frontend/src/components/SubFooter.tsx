import opra from "../images/opra.png";
import myNJ from "../images/myNJ.png";
import njoit from "../images/njoit.png";
import { Facebook } from "../svg/Facebook";
import { Twitter } from "../svg/Twitter";
import { YouTube } from "../svg/Youtube";
import { LinkedIn } from "../svg/LinkedIn";

export const SubFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div className="sub-footer">
      <div className="container">
        <div className="links">
          <div>
            <a href="https://nj.gov/opra/" target="_blank" rel="noopener noreferrer">
              <img src={opra} alt="NJ Open Public Records Act" width={166} height={45} />
            </a>
            <a
              href="https://my.state.nj.us/openam/UI/Login"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={myNJ} alt="myNJ Portal Logo" width={165} height={38} />
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
                >
                  <Twitter />
                </a>
              </li>
              <li>
                <a
                  className="facebook"
                  href="https://www.facebook.com/NJGov"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook />
                </a>
              </li>
              <li>
                <a
                  className="youtube"
                  href="https://www.youtube.com/user/NewJerseyGovernment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTube />
                </a>
              </li>
              <li>
                <a
                  className="linkedin"
                  href="https://www.linkedin.com/company/state-of-new-jersey/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedIn />
                </a>
              </li>
            </ul>
            <p>Copyright &copy; State of New Jersey, 1996-{year}</p>
          </div>
        </div>
        <a target="_blank" rel="noopener noreferrer" href="https://nj.gov/it/">
          <img src={njoit} alt="NJ Office of Information Technology" width={157} height={26} />
        </a>
      </div>
    </div>
  );
};
