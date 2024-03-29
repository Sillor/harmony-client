import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import checkValidPassword from "../utils/checkValidPassword";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatusMessage from "../components/ui/status-message";
import PasswordVisibilityToggle from "../components/ui/password-visibility-toggle";
import { register } from "../utils/db";

const Register = () => {
  const [inputData, setInputData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  const [checkedPassword, setCheckedPassword] = useState({
    error: null,
    message: "",
  });

  const [isPasswordMatch, setIsPasswordMatch] = useState(null);
  const [isHiddenPassword, setIsHiddenPassword] = useState(true);
  const [isHiddenConfirmPassword, setIsHiddenConfirmPassword] = useState(true);

  const handlePasswordVisibility = () => {
    setIsHiddenPassword((prev) => !prev);
  };

  const handleConfirmPasswordVisibility = () => {
    setIsHiddenConfirmPassword((prev) => !prev);
  };

  const handleOnChange = (event) => {
    setInputData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePasswordOnChange = (event) => {
    setCheckedPassword(checkValidPassword(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // For each 'inputData' field, set the corresponding error to false if the inputData value is a truthy.
    // Else, set the error to be true.
    Object.keys(inputData).forEach((field) => {
      const value = inputData[field];
      setErrors((prev) => ({ ...prev, [field]: value ? false : true }));
    });

    inputData.password !== inputData.confirmPassword
      ? setIsPasswordMatch(false)
      : setIsPasswordMatch(true);
  };

  const finishSubmit = () => {
    register({ email: inputData.email, password: inputData.password }).then(
      (data) => {
        if (!data.success) {
          setLoginError(data.message);
          return;
        }
        navigate("/");
      }
    );
  };

  useEffect(() => {
    // Set 'isErrors' to true if 'errors' has at least one truthy value or one null value
    const isErrors = Object.values(errors).some(
      (error) => error === true || error === null
    );

    // If the conditions are satisfied, submit the form
    if (!isErrors && !checkedPassword.error && isPasswordMatch) {
      finishSubmit();
    }
  }, [errors, checkedPassword.error, isPasswordMatch]);

  return (
    <div className="h-[calc(100vh-6rem)] flex items-center">
      <Card className="w-[350px] md:w-[423px] dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="mb-3">Create an Account</CardTitle>
          <CardDescription>
            Welcome to Harmony, where teamwork thrives and collaboration
            blossoms.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <form onSubmit={(event) => handleSubmit(event)}>
            <div className="grid w-full items-center gap-4">
              {/* First name */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleOnChange}
                  className={
                    errors.firstName && "border-red-500 dark:border-red-400"
                  }
                />
                {/* Error for First Name field */}
                <StatusMessage
                  error={errors.firstName}
                  message="First Name field is required"
                />
              </div>
              {/* Last name */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleOnChange}
                  className={
                    errors.lastName && "border-red-500 dark:border-red-400"
                  }
                />
                {/* Error for Last Name field */}
                <StatusMessage
                  error={errors.lastName}
                  message="Last Name field is required"
                />
              </div>
              {/* Email */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleOnChange}
                  className={
                    errors.email && "border-red-500 dark:border-red-400"
                  }
                />
                {/* Error for Email field */}
                <StatusMessage
                  error={errors.email}
                  message="Email field is required"
                />
              </div>
              {/* Password */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    type={isHiddenPassword ? "password" : "text"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    onChange={(event) => {
                      handleOnChange(event);
                      handlePasswordOnChange(event);
                    }}
                    className={
                      errors.password || isPasswordMatch === false
                        ? "border-red-500 dark:border-red-400 pr-10"
                        : "pr-10"
                    }
                  />
                  <PasswordVisibilityToggle
                    isHidden={isHiddenPassword}
                    handleToggle={handlePasswordVisibility}
                  />
                </div>
                {/* Error for Password field */}
                <StatusMessage
                  error={errors.password}
                  message="Password field is required"
                />
              </div>
              {/* Confirm Password */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={isHiddenConfirmPassword ? "password" : "text"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleOnChange}
                    className={
                      errors.confirmPassword || isPasswordMatch === false
                        ? "border-red-500 dark:border-red-400 pr-10"
                        : "pr-10"
                    }
                  />
                  <PasswordVisibilityToggle
                    isHidden={isHiddenConfirmPassword}
                    handleToggle={handleConfirmPasswordVisibility}
                  />
                </div>
                {/* Error for Confirm Password field */}
                <StatusMessage
                  error={errors.confirmPassword}
                  message="Confirm Password field is required"
                />
                {/* Error for when passwords do not match */}
                <StatusMessage
                  error={
                    isPasswordMatch === false &&
                    !errors.confirmPassword &&
                    !errors.password
                  }
                  message="Passwords do not match"
                />
              </div>
              {/* Error for when the password does not meet the requirements */}
              <StatusMessage
                error={checkedPassword.error}
                message={checkedPassword.message}
              />
              {/* Create Account Button */}
              <div className="flex justify-end mt-3">
                <Button type="submit" variant="outline">
                  Create
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-start">
          <CardDescription>
            Already have an account?{" "}
            <Link className="text-primary underline cursor-pointer" to="/login">
              Log In
            </Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
