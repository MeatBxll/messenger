import { Avatar, Box, Button, Grid } from "@mui/material";
import { useState } from "react";
import type { User } from "../../../../../types";
import { pfpMap } from "../../../../../components/pfp";
import { useChangPfpMutation } from "../../../../../api/apiRoutes/userApi";

interface MyDashProps {
  user: User;
}

export const MyDash = ({ user }: MyDashProps) => {
  const [selectedPfpIndex, setSelectedPfpIndex] = useState<number | null>(null);
  const [changePfp, { isLoading }] = useChangPfpMutation();

  const handleSelect = (index: number) => {
    setSelectedPfpIndex(index);
  };

  const handleSubmit = async () => {
    if (selectedPfpIndex === null) return;

    try {
      await changePfp(selectedPfpIndex).unwrap();
      alert("✅ Profile picture updated!");
    } catch {
      alert("❌ Failed to update profile picture.");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      {/* Left Column */}
      <Box
        sx={{
          flex: 1,
          px: "3rem",
          py: "1rem",
          fontSize: "1.3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>Display name: {user.name}</p>
        <p>Your email: {user.email}</p>
        <p>Your id: {user.id}</p>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <p>Your Pfp: </p>
          <Avatar
            sx={{ height: "10rem", width: "10rem" }}
            variant="square"
            alt={`Pfp ${user.pfpIndex}`}
            src={pfpMap[user.pfpIndex]}
          />
        </Box>
      </Box>

      {/* Right Column */}
      <Box
        sx={{
          flex: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(0,0,0,0.2)",
            height: "90%",
            width: "90%",
            borderRadius: "0.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
            gap: "2rem",
            overflow: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <h2 style={{ letterSpacing: ".02rem" }}>Swap Pfp</h2>

          <Grid container spacing={2} justifyContent="center">
            {Object.entries(pfpMap).map(([indexStr, url]) => {
              const index = Number(indexStr);
              return (
                <Grid key={index}>
                  <Button
                    onClick={() => handleSelect(index)}
                    variant={
                      selectedPfpIndex === index ? "contained" : "outlined"
                    }
                    sx={{
                      padding: 1,
                      borderRadius: "1rem",
                      borderColor:
                        selectedPfpIndex === index ? "primary.main" : "gray",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.light",
                      },
                    }}
                  >
                    <Avatar
                      src={url}
                      alt={`PFP ${index}`}
                      sx={{ width: 60, height: 60 }}
                      variant="square"
                    />
                  </Button>
                </Grid>
              );
            })}
          </Grid>

          <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
            Refresh to see any changes
          </p>

          <Button
            onClick={handleSubmit}
            variant="outlined"
            disabled={selectedPfpIndex === null || isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
