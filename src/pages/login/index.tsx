import LoginLayout from "@/layout/login-layout";
import { useEffect, useState } from "react";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import banner from "../../assets/img/login.png";
import logo from "../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import _AuthApi, {
  LoginRequestModel,
  LoginResponseModel,
} from "@/api/controller/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoading } from "@/context/loading-context";
import { setLoginStorage } from "@/helpers/set-storage";
import { useAlert } from "@/context/alert-context";
import { CryptoHelper } from "@/helpers/encrypt-decrypt";

const PageLogin = (): JSX.Element => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setAlertContext } = useAlert();
  const { setLoadingContext } = useLoading();
  const [payload, setPayload] = useState<LoginRequestModel>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const { mutate: onLogin, isPending: loadLogin } = useMutation({
    mutationFn: (payload: LoginRequestModel) => _AuthApi().login(payload),
    onSuccess: (response: LoginResponseModel) => {
      const isRefactorPassword = response.profile?.isRefactorPassword;
      setLoginStorage(
        response.profile as Record<string, any>,
        response.token as string,
      );
      queryClient.clear();
      if (!isRefactorPassword) {
        return navigate("/change-password/");
      }
      setLoadingContext(false);
      const id = encodeURIComponent(CryptoHelper.encrypt(response.profile?.id));
      navigate(`/personnel-info/information/${id}`);
    },
    onError: (error: any) => {
      setAlertContext({
        message: error.message,
        type: "warning",
      });
    },
    onSettled: () => {
      setLoadingContext(false);
    },
  });

  const onSubmitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(payload);
  };

  useEffect(() => {
    setLoadingContext(loadLogin);
  }, [loadLogin, setLoadingContext]);
  return (
    <>
      <LoginLayout>
        <form onSubmit={onSubmitLogin}>
          <div className="h-screen flex bg-gray-200">
            <div className="w-full md:w-[35%] flex flex-col justify-center bg-white px-16">
              <div className="flex sapce-x-2">
                <p className="text-2xl text-left text-gray-700">ระบบ</p>
                <p className="text-2xl text-gray-700 font-semibold  ">
                  ฐานข้อมูลบุคลากรอัจฉริยะ (Smart P-File)
                </p>
              </div>
              <p className="text-lg text-left text-gray-700 mb-8 mt-3">
                กลุ่มบริหารงานบุคคล โรงเรียนอนุบาลพิษณุโลก
              </p>
              <TextField
                autoComplete="off"
                fullWidth
                required
                onChange={onChangeInput}
                value={payload.username}
                name="username"
                label="ชื่อผู้ใข้งาน"
                type="text"
                sx={{ mt: 2 }}
              />
              <TextField
                autoComplete="current-password"
                fullWidth
                required
                onChange={onChangeInput}
                value={payload.password}
                name="password"
                label="รหัสผ่าน"
                type={showPassword ? "text" : "password"}
                sx={{ mt: 2, mb: 8 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={onToggleShowPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button type="submit" size="large" variant="contained">
                เข้าสู่ระบบ
              </Button>
            </div>

            <div className=" hidden md:block md:w-[65%] items-center justify-center">
              <Logo />
              <img src={banner} className="w-dvw h-dvh object-cover" />
            </div>
          </div>
        </form>
      </LoginLayout>
    </>
  );
};

const Logo = () => {
  return (
    <div className="absolute z-30 top-10 left-100 ">
      <div className="flex items-center gap-4">
        <img src={logo} className="w-[120px] h-full rounded-full p-1" />
        <div className="text-white">
          <p className="text-5xl font-semibold">โรงเรียนอนุบาลพิษณุโลก</p>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
