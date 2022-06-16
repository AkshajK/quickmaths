import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";

const ForceDisconnected = () => {
  return (
    <div>
      <Dialog fullScreen open={true} onClose={() => {}}>
        <DialogContent style={{ backgroundColor: "#6c57f5", color: "white" }}>
          <Box marginTop="20px">
            <Alert variant="standard" severity="warning">
              You have been disconnected - perhaps for opening another Tab of Quickmaths. Refresh to
              return to QuickMaths!
            </Alert>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForceDisconnected;
