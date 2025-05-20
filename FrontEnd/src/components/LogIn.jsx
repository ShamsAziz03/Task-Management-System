import "../styles/LogIn.css";
import { useLazyQuery, gql, useMutation } from "@apollo/client";
import { useRef, useEffect, useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";

const LogIn = () => {
  const container = useRef(null);
  const studentIdField = useRef(null);

  const [signInUname, setSignInUname] = useState("");
  const [signInPass, setSignInPass] = useState("");
  const [signUpUname, setSignUpUname] = useState("");
  const [signUpPass, setSignUpPass] = useState("");
  const [stuRole, setStuRole] = useState(false);
  const [stuId, setStuId] = useState("");

  const { setCurrUser } = useContext(AppContext);
  const { setLogHome } = useContext(AppContext);



  //run what inside useeffect after the component rendered
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (container.current) {
        container.current.classList.add("sign-in");
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  const toggle = () => {
    if (container) {
      container.current.classList.toggle("sign-in");
      container.current.classList.toggle("sign-up");
    }
  };

  ///////////////////////////////////////////////////////

  const GET_USER = gql`
    query GetUser($name: String!, $password: String!) {
      user(name: $name, password: $password) {
        name
        password
        role
        stu_id
      }
    }
  `;

  const [getUser, { data, loading, error }] = useLazyQuery(GET_USER, {
    onCompleted: (data) => {
      if (data && data.user) {
        const user = data.user;
        setCurrUser(user);

        alert("Welcome " + user.role + " " + user.name + "!");
        setLogHome(1);
      } else {
        alert("Please Sign Up first!");
      }
    },
    onError: (err) => {
      alert("Query error: " + err.message);
    },
  });

  const signIn = () => {
    let founded = false;
    if (!signInUname || !signInPass) {
      alert("Please fill all fields.");
      return;
    }
    getUser({ variables: { name: signInUname, password: signInPass } });
  };

  const toggleStudentIdField = (checked) => {
    if (checked) {
      studentIdField.current.style.display = "block";
      setStuRole(true);
    } else {
      studentIdField.current.style.display = "none";
      setStuRole(false);
    }
  };

  //////////////////////////
  const ADD_User = gql`
    mutation (
      $stu_id: String
      $name: String!
      $password: String!
      $role: String!
    ) {
      addUser(stu_id: $stu_id, name: $name, password: $password, role: $role) {
        stu_id
        name
        password
        role
      }
    }
  `;

  const [addUser, { addUserData, addUserLoading, addUserError }] = useMutation(
    ADD_User,
    {
      onCompleted: (addUserData) => {
        if (addUserData && addUserData.addUser) {
          const user = addUserData.addUser;
          setCurrUser(user);
        }
      },
      onError: (err) => {
        alert("Query error: " + err.message);
      },
    }
  );

  ///////////////////////////
  const signUp = () => {
    if (!signUpUname || !signUpPass) {
      alert("Please fill all fields.");
      return;
    }

    const Role = stuRole ? "student" : "admin";
    const studentId = stuRole ? stuId : "0";
    console.log({
      name: signUpUname,
      password: signUpPass,
      role: Role,
      stu_id: studentId,
    });
    addUser({
      variables: {
        stu_id: studentId,
        name: signUpUname,
        password: signUpPass,
        role: Role,
      },
    });

    toggle();
  };

  return (
    <div id="holeContent">
      <div ref={container} id="container" className="container">
        <div className="row">
          <div className="col align-items-center flex-col sign-up">
            <div className="form-wrapper align-items-center">
              <div className="form sign-up">
                <div className="input-group">
                  <i className="bx bxs-user"></i>
                  <input
                    type="text"
                    placeholder="Username"
                    id="signUpUname"
                    onChange={(e) => setSignUpUname(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <i className="bx bxs-lock-alt"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    id="signUpPass"
                    onChange={(e) => setSignUpPass(e.target.value)}
                  />
                </div>

                <div className="input-group checkbox-group">
                  <input
                    type="checkbox"
                    id="student-checkbox"
                    onClick={(e) => {
                      const newChecked = e.target.checked;
                      toggleStudentIdField(newChecked);
                    }}
                    onChange={() => {}}
                  />
                  <label htmlFor="student-checkbox"> I am a student</label>
                </div>

                <div
                  ref={studentIdField}
                  className="input-group"
                  id="studentIdField"
                  style={{ display: "none" }}
                >
                  <i className="bx bxs-lock-alt"></i>
                  <input
                    type="text"
                    placeholder="University ID"
                    id="uId"
                    onChange={(e) => setStuId(e.target.value)}
                  />
                </div>

                <button onClick={signUp}>Sign up</button>
                <p>
                  <span>Already have an account?</span>
                  <b onClick={toggle} className="pointer">
                    Sign in here
                  </b>
                </p>
              </div>
            </div>
          </div>

          <div className="col align-items-center flex-col sign-in">
            <div className="form-wrapper align-items-center">
              <div className="form sign-in">
                <div className="input-group">
                  <i className="bx bxs-user"></i>
                  <input
                    type="text"
                    placeholder="Username"
                    id="signInUname"
                    onChange={(e) => setSignInUname(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <i className="bx bxs-lock-alt"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    id="signInPass"
                    onChange={(e) => setSignInPass(e.target.value)}
                  />
                </div>

                <div className="input-group checkbox-group">
                  <input type="checkbox" id="remember-me" />
                  <label htmlFor="remember-me"> Stay Signed in </label>
                </div>

                <button onClick={signIn}>Sign in</button>
                <p>
                  <b>Forgot password?</b>
                </p>
                <p>
                  <span>Don't have an account?</span>
                  <b onClick={toggle} className="pointer">
                    Sign up here
                  </b>
                </p>
              </div>
            </div>
          </div>

          <div className="row content-row">
            <div className="col align-items-center flex-col">
              <div className="text sign-in">
                <h2>Welcome</h2>
              </div>
              <div className="img sign-in"></div>
            </div>

            <div className="col align-items-center flex-col">
              <div className="img sign-up"></div>
              <div className="text sign-up">
                <h2>Join with us</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LogIn;
