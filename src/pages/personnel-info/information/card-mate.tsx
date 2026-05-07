import { MateAndChildModel } from "@/api/controller/master-user";
import { TextField } from "@mui/material";
// import { ModelApplicantProps } from "src/apis/applicant";

interface CardAddressProps {
  form: MateAndChildModel; //ModelApplicantProps;
  returnForm: (form: any) => void; //(form: ModelApplicantProps) => void;
  isDisabled: boolean;
  //   returnForm: (form: ModelApplicantProps) => void;
}

const CardMate = ({
  form,
  returnForm,
  isDisabled,
}: CardAddressProps): JSX.Element => {
  const onChangeFormCard = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const newForm = {
      ...form,
      [name]: value,
    };
    returnForm(newForm);
  };

  return (
    <>
      <div className="flex flex-wrap py-3">
        <div className="lg:basis-1/5 basis-full px-3 mb-3">
          <p className="mb-1">คำนำหน้าชื่อ</p>
          <TextField
            name="title"
            value={form.title}
            onChange={onChangeFormCard}
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
            value={form.firstname}
            onChange={onChangeFormCard}
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
            value={form.surname}
            onChange={onChangeFormCard}
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
            value={form.address}
            onChange={onChangeFormCard}
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
            value={form.idCardNumber}
            onChange={onChangeFormCard}
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
            value={form.phone}
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
            value={form.nationality}
            onChange={onChangeFormCard}
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
            value={form.ethnicity}
            onChange={onChangeFormCard}
            size="small"
            fullWidth
            autoComplete="off"
            disabled={isDisabled}
          />
        </div>
      </div>
    </>
  );
};

export default CardMate;
