import {
  Box,
  Button,
  FormHelperText,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { btnArr } from "@/data";
import LoginLayout from "@/layout/LoginLayout/LoginLayout";
import { apiRouterCall } from "@/api-services/service";
import { api_configs } from "@/api-services";
import { toast } from "react-hot-toast";
import ButtonCircularProgress from "@/components/ButtonCircularProgress";
import CustomHead from "@/components/CustomHead";
import moment from "moment";
import { calculateTimeLeft } from "@/utils";
import TermComp from "@/components/TermComp";
import { MdOutlineMailOutline } from "react-icons/md";

const ForgotComponent = styled(Box)(({ theme }) => ({
  height: "100%",
  position: "relative",
  zIndex: "999",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflowY: "auto",
  [theme.breakpoints.down("sm")]: {
    alignItems: "flex-start",
  },

  "& .loginBox": {
    height: "initial",
    margin: "15px auto",
    maxWidth: "95%",
    width: "640px",
    maxHeight: "100%",
    display: "flex",
    flexDirection: "column",
    "& .mainBox": {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      boxShadow: "none",
      padding: "40px",
      [theme.breakpoints.down("xs")]: {
        padding: "20px",
      },
      "& h2": {
        textAlign: "center",
        paddingBottom: "0px",
        fontSize: "30px",
        fontWeight: "300",
        fontFamily: "'Open Sans', sans-serif",
        [theme.breakpoints.down("sm")]: {
          paddingBottom: "2px",
          fontSize: "22px !important",
        },
      },
    },
    "& .titleBox": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
    },
  },
}));

export default function ForgotPassword() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const formInitialSchema = {
    email: "",
  };
  const formValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email.")
      .max(256, "Should not exceeds 256 characters.")
      .required("Email is required."),
  });

  const handleFormSubmit = async (values) => {
    try {
      setisLoading(true);
      const formData = {
        email: values.email.toLowerCase(),
      };
      const response = await apiRouterCall({
        method: "PATCH",
        url: api_configs.forgotPasswordU,
        bodyData: formData,
      });
      if (response.data.responseCode == 200) {
        toast.success(response.data.responseMessage);
        router.replace(`/auth/forgot-verify?${values.email.toLowerCase()}`);
        let endTime = moment().add(3, "m").unix();
        const timeLefts = calculateTimeLeft(endTime * 1000);
        sessionStorage.setItem("otpTimer", JSON.stringify(timeLefts));
      } else {
        toast.error(response.data.responseMessage);
      }
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      console.error("Error:", error);
    }
  };

  const handleResend = () => {
    startTimer();
  };

  return (
    <ForgotComponent>
      {" "}
      <Box className="loginBox">
        <Box align="center" mb={5.4}>
          <Typography variant="h2" color="#fff" className="loginText">
            Forgot Password
          </Typography>

          <Typography variant="body1" color="#FFFFFF99" mt={2}>
            Enter your registered  Email here, we will send a verification link
            to retrieve your password.
          </Typography>
        </Box>

        <Formik
          initialValues={formInitialSchema}
          initialStatus={{
            success: false,
            successMsg: "",
          }}
          validationSchema={formValidationSchema}
          onSubmit={(values) => handleFormSubmit(values)}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            touched,
            values,
            isValid,
            dirty,
          }) => (
            <Form>
              <Box>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Email"
                  type="text"
                  name="email"
                  value={values.email.toLowerCase()}
                  error={Boolean(touched.email && errors.email)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={isLoading}
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment>
                        <MdOutlineMailOutline
                          style={{
                            color: "#FFFFFF99",
                            fontSize: "24px",
                            paddingRight: "10px",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormHelperText error>
                  {touched.email && errors.email}
                </FormHelperText>
              </Box>
              <Box mt={5.5} align="center">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  // disabled={isLoading}
                  disabled={!(isValid && dirty) || isLoading}
                >
                  Next {isLoading && <ButtonCircularProgress />}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>

        <Typography
          className="h6"
          fontWeight="500"
          color="primary"
          style={{ lineHeight: "0px", cursor: "pointer" }}
          mt={5.5}
          align="center"
          onClick={() => !isLoading && router.push("/auth/login")}
        >
          Go Back To Login
        </Typography>
      </Box>
    </ForgotComponent>
  );
}

ForgotPassword.getLayout = function getLayout(page) {
  return <LoginLayout>{page}</LoginLayout>;
};
