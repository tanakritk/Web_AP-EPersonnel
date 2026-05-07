import { Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface InputFileCustomProps {
  name: string;
  multiFile?: boolean;
  disabled?: boolean;
  permissionChangeFile?: boolean;
  permissionDownloadFile?: boolean;
  returnChangeFile?: (files: any) => void;
  returnDeleteByFile?: (val: any) => void;
  returnDownloadFile?: (val: any) => void;
  fileValue: any;
  accept?: '*' | 'application/pdf' | '.xlsx' | '.xls'
}

const InputFileCustom = ({
  name,
  multiFile = false,
  permissionChangeFile = false,
  permissionDownloadFile = false,
  returnChangeFile,
  returnDeleteByFile,
  returnDownloadFile,
  fileValue,
  accept = '*',
  disabled=false
}: InputFileCustomProps) => {
  const onChangeFile = (event: any) => {
    if (event.target.files) {
        console.log("event.target.files--> ", event.target.files)
      const filesArray = Array.from(event.target.files).map(
        (file: any) => file
      );
      if (returnChangeFile) {
        const input = document.getElementById(name) as HTMLInputElement | null;
        if (input) {
            input.value = '';
        }
        if( multiFile === true ){
            let cloneFileValue = [...fileValue];
            cloneFileValue.push(filesArray[0])
            return returnChangeFile(cloneFileValue);
        }else{
            return returnChangeFile(filesArray);
        }
        
      }
    }
  };

  const onDownload = (item: any) => {
    if (returnDownloadFile) {
      return returnDownloadFile(item);
    }
  };

  const onDeleteFiles = (item: any, index: number) => {
    let cloneFileValue = [...fileValue];
    cloneFileValue.splice(index, 1);
    if (returnChangeFile) {
      returnChangeFile(cloneFileValue);
    }
    if (returnDeleteByFile) {
      returnDeleteByFile(item); // ถ้ามีคีย์นี้ส่งมา หากต้องการลบไฟล์ไหน ให้ return ข้อมูลไฟล์นั้นออกไป
    }
  };
  return (
    <div className="flex space-x-3 ">
      <div className="space-y-1">
        <label htmlFor={name}>
          <Button variant="outlined"  component="span" disabled={!permissionChangeFile || disabled} >
            <div className="flex items-center space-x-1">
              <AttachFileIcon />
              <span>ไฟล์แนบ</span>
            </div>
          </Button>
        </label>
        <input
          type="file"
          accept={accept}
          name={name}
          id={name}
          className="hidden"
          multiple={multiFile}
          onChange={onChangeFile}
        />
      </div>
      <div className="flex flex-wrap items-start space-x-2">
        {fileValue.map((item: any, index: number) => (
          <div
            className="flex space-x-5 h-full items-center flex bg-primary-4  px-3 py-1 rounded-lg text-primary"
            key={"file" + index}
          >
            <span>{item?.name}</span>
            <div className="flex space-x-1">
              {(permissionChangeFile && !disabled) && (
                <DeleteIcon
                  className="cursor-pointer hover:text-red-500"
                  onClick={() => onDeleteFiles(item, index)}
                />
              )}
              {permissionDownloadFile && (
                <FileDownloadIcon
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => onDownload(item)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputFileCustom;
