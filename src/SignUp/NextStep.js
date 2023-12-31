import React, { Fragment, useState, useEffect } from 'react';
import './NextStep.css';
import image2 from '../Assets/Group 1000001796.png';
import image3 from '../Assets/image 67.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendVerificationEmail, signUpClient, verifyOtp } from '../Service/auth.service';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TbDiscountCheckFilled } from "react-icons/tb";


export function NextStep() {

    const navigateToExploreSignup = useNavigate();
    const location = useLocation();
    // console.log(location, "location")
    const { selectedCountry } = location.state || {};
    // console.log(selectedCountry, "selectedCountry")


    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        country: "",
        phone: "",
        role: "client",
    });

    const [signupError, setSignUpErrors] = useState({
        fullName: '',
        email: '',
        phone: '',
    })


    const [email, setEmail] = useState('');
    const [enteredOTP, setEnteredOTP] = useState('');
    const [showVerifySection, setShowVerifySection] = useState(false);
    const [timer, setTimer] = useState(300);
    const [termsCheckedOne, setTermsCheckedOne] = useState(false);
    const [termsCheckedTwo, setTermsCheckedTwo] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);


    const handleCheckboxChange = (e) => {
        const checkboxName = e.target.name;

        if (checkboxName === "termsCheckedOne") {
            setTermsCheckedOne(e.target.checked);
        } else if (checkboxName === "termsCheckedTwo") {
            setTermsCheckedTwo(e.target.checked);
        }
    };


    const handleClickNextStepExplore = async () => {

        const requiredFieldsFromInput = ['fullName', 'email', 'phone'];

        const newErrors = {};
        requiredFieldsFromInput.forEach((field) => {
            if (!signupData[field]) {
                newErrors[field] = `Please enter ${field === 'fullName' ? 'your full name' : field}`;
            }
        });
        setSignUpErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        if (!termsCheckedOne && !termsCheckedTwo) {
            toast.error('Please agree to the terms and conditions.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                // closeOnClick: false,
                closeButton: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
            return;
        }

        try {

            // console.log('Sign Data:', signupData);
            // console.log('Selected Country:', selectedCountry);
            const userData = await signUpClient({ ...signupData, country: selectedCountry });

            localStorage.setItem('clientId', userData.result._id);

            // console.log(response);
            toast.success('Signup successful', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeButton: false,
                progress: undefined,
                theme: "colored",
            });
            navigateToExploreSignup('/nextstepexplore');
        }
        catch (error) {
            // console.error('Error during sign up:', error.message);
            toast.error('An unexpected error occurred. Please try again.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                // closeOnClick: false,
                closeButton: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'email') {
            setEmail(value);
            setSignupData({ ...signupData, email: value });
        } else if (name === 'fullName') {
            setSignupData({ ...signupData, fullName: value });
        } else {
            setSignupData({ ...signupData, [name]: value });
        }
        setSignUpErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    // verify otp steps

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer > 0) {
                    return prevTimer - 1;
                } else {
                    clearInterval(countdown);
                    return 0;
                }
            });
        }, 1000);

        return () => {
            clearInterval(countdown);
        };
    }, []);


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleResendOTP = () => {
        setTimer(300);
    };

    const handleVerifyClick = async () => {
        try {
            const result = await sendVerificationEmail(email);
            if (result.success) {
                toast.success(result.message, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeButton: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
                setShowVerifySection(true);
            } else {
                toast.error(result.message);
            }
            // console.log(result, "result");
        } catch (error) {
            // console.error('Error handling verification email:', error);
            toast.error('An unexpected error occurred. Please try again.', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeButton: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    const handleVerifyOtp = async () => {
        console.log("enetr11")
        try {

            if (!enteredOTP) {
                toast.error('Please enter a 4-digit OTP');
                return;
            }

            const result = await verifyOtp(enteredOTP);

            if (result && result.success) {
                toast.success(result.message, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeButton: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
                setOtpVerified(true);
                setTimeout(() => {
                    setOtpVerified(true);
                }, 3000);
            }
            else {
                toast.error(result.message, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeButton: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "colored",
                });
            }
        } catch (error) {
            // console.error('Error handling OTP verification:', error);
            toast.error('An unexpected error occurred. Please try again.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                // closeOnClick: false,
                closeButton: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    return (
        <Fragment>
            <div className="main_signup">
                <div className="sub_side_signup">
                    <h3>Manage your Digital Identify</h3>
                    <p>Tell us more about your workspace so we can provide you a personalised experience tailored to your needs and preferences</p>
                    <img src={image2} alt="" />
                </div>

                <div className="sub_signup_form12">
                    <div className="input_fields12">
                        <h4>Sign up now</h4> 
                        <div className="main_inputs_f">
                            <div className="input1">
                                <label htmlFor="">Full name</label>
                                <input type="text" name="fullName" id="fullName" placeholder='Enter here'
                                    value={signupData.fullName}
                                    onChange={handleInputChange}
                                    required />
                                <div className="signup_error_message">{signupError.fullName}</div>
                            </div>
                            <div className="input1">
                                <label htmlFor="">Mobile number(optional)</label>
                                <input type="text" name="phone" id="phone" placeholder='Enter here'
                                    value={signupData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="input2">
                            <label htmlFor="">Email address</label>
                            <div className="inputs_new">
                                <input type="email" name="email" id="email" placeholder='Enter here'
                                    value={signupData.email}
                                    onChange={handleInputChange}
                                    required />

                                <button onClick={handleVerifyClick}>Verify</button>
                            </div>
                            <div className="signup_error_message">{signupError.email}</div>
                            {
                                showVerifySection && (
                                    <div className="new_verify">
                                        <div className="verify_now_otp">
                                            <h1>Check your mail</h1>
                                            <img src={image3} alt="" />
                                        </div>
                                        <div className="para_verify">
                                            <p>Please enter the 4 digit verification that we sent to your mail.the code will be valid for next 5 minutes</p>
                                        </div>

                                        <div className="verify_butn">
                                            <input type="Number" placeholder='0000'
                                                onChange={(e) => {
                                                    const enteredValue = e.target.value;

                                                    // Check if the entered value is a 4-digit OTP
                                                    if (/^\d{4}$/.test(enteredValue)) {
                                                        setEnteredOTP(enteredValue);
                                                    }
                                                }} />
                                            {otpVerified ? (
                                                <span className='new_checked'><TbDiscountCheckFilled /></span>
                                            ) : (
                                                <button onClick={handleVerifyOtp}>Submit</button>
                                            )}

                                        </div>
                                        <div className="verify_butn12">
                                            <p>{formatTime(timer)}</p>
                                            <button onClick={handleResendOTP}>Resend OTP</button>
                                        </div>
                                    </div>
                                )
                            }


                        </div>
                        <div className="new_terms_c">
                            <input
                                type="checkbox"
                                name="termsCheckedOne"
                                required
                                checked={termsCheckedOne}
                                onChange={handleCheckboxChange}
                            />
                            <p>By creating an account , i agree to our  <a href="12">Terms of use</a> and <a href="12">Privacy policy</a></p>
                        </div>
                        <div className="new_terms_c1">
                            <input
                                type="checkbox"
                                name="termsCheckedTwo"
                                required
                                checked={termsCheckedTwo}
                                onChange={handleCheckboxChange}

                            />
                            <p>By creating an account,i am also consenting to receive SMS messages and emails,including product new feature updates,events, and marketing promotions.</p>
                        </div>
                        <div className="btn_sign">
                            <button onClick={handleClickNextStepExplore}>Sign up</button>
                            <p>Already have an account?<Link to={'/login'}>Log in</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
