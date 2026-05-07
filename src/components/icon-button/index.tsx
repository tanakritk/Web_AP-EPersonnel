import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DescriptionIcon from "@mui/icons-material/Description";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

interface ButtonProps {
  onClick?: () => void;
}

const ViewButton = ({ onClick }: ButtonProps): JSX.Element => {
  return (
    <IconButton onClick={onClick}>
      <VisibilityIcon
        fontSize="inherit"
        color="success"
        // sx={{ "&:hover": { color: "#ffffff" } }}
      />
    </IconButton>
  );
};

const EditButton = ({ onClick }: ButtonProps): JSX.Element => {
  return (
    <IconButton onClick={onClick}>
      <EditIcon
        fontSize="inherit"
        color="warning"
        // sx={{ "&:hover": { color: "#ffffff" } }}
      />
    </IconButton>
  );
};

const DeleteButton = ({ onClick }: ButtonProps): JSX.Element => {
  return (
    <IconButton onClick={onClick}>
      <DeleteIcon
        fontSize="inherit"
        color="error"
        // sx={{ "&:hover": { color: "#ffffff" } }}
      />
    </IconButton>
  );
};

const ResetButton = ({ onClick }: ButtonProps): JSX.Element => {
  return (
    <IconButton onClick={onClick}>
      <RestoreIcon
        fontSize="inherit"
        color="success"
        // sx={{ "&:hover": { color: "#ffffff" } }}
      />
    </IconButton>
  );
};

const DownloadButton = ({ onClick }: ButtonProps): JSX.Element => {
  return (
    <IconButton onClick={onClick}>
      <FileDownloadIcon
        fontSize="inherit"
        color="success"
        // sx={{ "&:hover": { color: "#ffffff" } }}
      />
    </IconButton>
  );
};

const DocsButton = ({ onClick }: ButtonProps): JSX.Element => {
  return (
    <IconButton onClick={onClick}>
      <DescriptionIcon
        fontSize="inherit"
        color="info"
        // sx={{ "&:hover": { color: "#ffffff" } }}
      />
    </IconButton>
  );
};

const ApproveButton = ({ onClick }: ButtonProps): JSX.Element => {
  return (
    <IconButton onClick={onClick}>
      <MarkEmailReadIcon
        fontSize="inherit"
        color="info"
        // sx={{ "&:hover": { color: "#ffffff" } }}
      />
    </IconButton>
  );
};

export {
  ViewButton,
  EditButton,
  DeleteButton,
  ResetButton,
  DownloadButton,
  DocsButton,
  ApproveButton,
};
