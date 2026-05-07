import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getLoginStorage } from "../../helpers/set-storage";

const UserInformation = () => {
  const [userData, serUserData] = useState<any>({
    name: "",
    department: "",
  });

  useEffect(() => {
    const profile = getLoginStorage()?.profile;
    serUserData({
      name: `${profile?.Firstname} ${profile?.Lastname}`,
      department: profile?.MASDepartment?.Name,
    });
  }, []);
  return (
    <div>
      <List dense>
        <ListItem>
          <Box display="flex" alignItems={"center"} gap={2}>
            <Avatar sx={{ width: 40, height: 40 }} alt="test" src="" />
            <Stack>
              <Typography fontWeight={"bold"}>{userData.name}</Typography>
              <ListItemText>{userData.department}</ListItemText>
            </Stack>
          </Box>
        </ListItem>
      </List>
    </div>
  );
};

export default UserInformation;
