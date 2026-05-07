import { MateAndChildModel } from "@/api/controller/master-user";
import { TextField } from "@mui/material";
// import { ModelApplicantProps } from "src/apis/applicant";

interface CardAddressProps {
  form: MateAndChildModel[]; //ModelApplicantProps;
  returnForm: (form: any) => void; //(form: ModelApplicantProps) => void;
  isDisabled: boolean;
  //   returnForm: (form: ModelApplicantProps) => void;
}

const CardChild = ({
  form,
  returnForm,
  isDisabled,
}: CardAddressProps): JSX.Element => {
  const onChangeFormCard = (name: string, value: string, index: number) => {
    // const { name, value } = event.target;
    const newForm: MateAndChildModel[] = [...form];
    newForm[index] = {
      ...newForm[index],
      [name]: value,
    };
    returnForm(newForm);
  };

  return (
    <>
      {form.map((item, index) => (
        <div
          className="relative border border-gray-500 rounded-lg p-6 my-10"
          key={"child" + index}
        >
          <span className="absolute top-0 left-4 -translate-y-1/2 px-2 text-lg font-semibold text-gray-400 bg-gray-100">
            บุตรคนที่ {index + 1}
          </span>
          <div className="flex flex-wrap py-3">
            <div className="lg:basis-1/5 basis-full px-3 mb-3">
              <p className="mb-1">คำนำหน้าชื่อ</p>
              <TextField
                name="title"
                value={item.title}
                onChange={(event) =>
                  onChangeFormCard(event.target.name, event.target.value, index)
                }
                size="small"
                fullWidth
                autoComplete="off"
                disabled={isDisabled}
              />
            </div>

            <div className="lg:basis-2/5 basis-full px-3 mb-3">
              <p className="mb-1">ชื่อ</p>
              <TextField
                name="firstname"
                value={item.firstname}
                onChange={(event) =>
                  onChangeFormCard(event.target.name, event.target.value, index)
                }
                size="small"
                fullWidth
                autoComplete="off"
                disabled={isDisabled}
              />
            </div>

            <div className="lg:basis-2/5 basis-full px-3 mb-3">
              <p className="mb-1">สกุล</p>
              <TextField
                name="surname"
                value={item.surname}
                onChange={(event) =>
                  onChangeFormCard(event.target.name, event.target.value, index)
                }
                size="small"
                fullWidth
                autoComplete="off"
                disabled={isDisabled}
              />
            </div>

            <div className="lg:basis-3/5 basis-full px-3 mb-3">
              <p className="mb-1">ที่อยู่</p>
              <TextField
                name="address"
                value={item.address}
                onChange={(event) =>
                  onChangeFormCard(event.target.name, event.target.value, index)
                }
                size="small"
                fullWidth
                autoComplete="off"
                disabled={isDisabled}
              />
            </div>

            <div className="lg:basis-1/5 basis-full px-3 mb-3">
              <p className="mb-1">เลขที่บัตรประชาชน / หนังสือเดินทาง</p>
              <TextField
                name="idCardNumber"
                value={item.idCardNumber}
                onChange={(event) =>
                  onChangeFormCard(event.target.name, event.target.value, index)
                }
                size="small"
                fullWidth
                autoComplete="off"
                disabled={isDisabled}
              />
            </div>

            <div className="lg:basis-1/5 basis-full px-3 mb-3">
              <p className="mb-1">เบอร์ติดต่อ</p>
              <TextField
                name="phone"
                value={item.phone}
                onChange={(event) =>
                  onChangeFormCard(event.target.name, event.target.value, index)
                }
                size="small"
                fullWidth
                autoComplete="off"
                disabled={isDisabled}
              />
            </div>

            <div className="lg:basis-1/5 basis-full px-3 mb-3">
              <p className="mb-1">สัญชาติ</p>
              <TextField
                name="nationality"
                value={item.nationality}
                onChange={(event) =>
                  onChangeFormCard(event.target.name, event.target.value, index)
                }
                size="small"
                fullWidth
                autoComplete="off"
                disabled={isDisabled}
              />
            </div>

            <div className="lg:basis-2/5 basis-full px-3 mb-3">
              <p className="mb-1">เชื้อชาติ</p>
              <TextField
                name="ethnicity"
                value={item.ethnicity}
                onChange={(event) =>
                  onChangeFormCard(event.target.name, event.target.value, index)
                }
                size="small"
                fullWidth
                autoComplete="off"
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardChild;
