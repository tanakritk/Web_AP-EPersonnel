import LoginLayout from "@/layout/login-layout";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import logo from "../../assets/img/logo.png";
import banner from "../../assets/img/login.png";
import { useAlert } from "@/context/alert-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseQueryModel } from "@/api/interface";
import { useLoading } from "@/context/loading-context";
import _MasterUserApi from "@/api/controller/master-user";
import { getLoginStorage, setLoginStorage } from "@/helpers/set-storage";
import { useNavigate } from "react-router-dom";

interface formProps {
  password: string;
  confirmPassword: string;
}

interface showPasswordProps {
  password: boolean;
  confirmPassword: boolean;
}

const PageChangePassword = (): JSX.Element => {
  const { setAlertContext } = useAlert();
  const { setLoadingContext } = useLoading();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<showPasswordProps>({
    password: false,
    confirmPassword: false,
  });
  const [form, setForm] = useState<formProps>({
    password: "",
    confirmPassword: "",
  });

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const { mutate: onActionChangePassword, isPending: isLoadingChangePassword } =
    useMutation({
      mutationFn: async ({
        id,
        payload,
      }: {
        id: number;
        payload: { password: string };
      }) => {
        return await _MasterUserApi().updatePassword(id, payload);
      },
      onSuccess: (response: BaseQueryModel) => {
        const token = getLoginStorage().token;
        queryClient.invalidateQueries({ queryKey: ["personnel-list"] });
        setLoginStorage(response.data as Record<string, any>, token as string);
        navigate("/");
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

  const onSubmitLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setAlertContext({
        message: "รหัสผ่านไม่ตรงกัน",
        type: "warning",
      });
    }

    const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      return setAlertContext({
        message: "รหัสผ่านต้องมีตัวเลขและตัวอักษรอย่างน้อย 8 ตัว",
        type: "warning",
      });
    }

    const profile = getLoginStorage().profile;
    const id = profile?.id;
    const payload = {
      password: form.password,
    };
    onActionChangePassword({ id: Number(id), payload });
  };

  const onToggleShowPassword = (
    state: "password" | "confirmPassword",
  ): void => {
    setShowPassword({
      ...showPassword,
      [state]: !showPassword[state],
    });
  };

  useEffect(() => {
    setLoadingContext(isLoadingChangePassword);
  }, [setLoadingContext, isLoadingChangePassword]);
  return (
    <>
      <LoginLayout>
        <form onSubmit={onSubmitLogin}>
          <div className="h-screen flex bg-gray-200">
            <div className="w-full md:w-[35%] flex flex-col justify-center bg-white px-16">
              <div className="flex sapce-x-2">
                <p className="text-3xl text-left text-gray-700">
                  เปลี่ยนรหัสผ่าน
                </p>
              </div>
              <TextField
                autoComplete="current-password"
                fullWidth
                required
                onChange={onChangeInput}
                value={form.password}
                name="password"
                label="รหัสผ่าน"
                type={showPassword.password ? "text" : "password"}
                sx={{ mt: 2 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => onToggleShowPassword("password")}
                        >
                          {showPassword.password ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                autoComplete="current-password"
                fullWidth
                required
                onChange={onChangeInput}
                value={form.confirmPassword}
                name="confirmPassword"
                label="ยืนยันรหัสผ่าน"
                type={showPassword.confirmPassword ? "text" : "password"}
                sx={{ mt: 2, mb: 8 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            onToggleShowPassword("confirmPassword")
                          }
                        >
                          {showPassword.confirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
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

export default PageChangePassword;
