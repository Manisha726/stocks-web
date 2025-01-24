import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid2,
} from "@mui/material";
import { fetchRealTimeStocks } from "../services/api";

const StockActionDialog = ({ open, onClose, stock, action, onSubmit }) => {
  const [quantity, setQuantity] = useState("");
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch real-time data when the dialog is opened
  useEffect(() => {
    const fetchStockData = async () => {
      if (stock?.symbol) {
        setLoading(true);
        setError("");
        try {
          const response = await fetchRealTimeStocks(stock.symbol);
          setRealTimeData(response?.data || {});
        } catch (err) {
          console.error("Error fetching real-time stock data:", err);
          setError("Failed to load stock data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (open) {
      fetchStockData();
    }
  }, [stock, open]);

  const handleSubmit = () => {
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    onSubmit({ ...stock, quantity, price: realTimeData?.price, action });
    setQuantity("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{`${action === "buy" ? "Buy" : "Sell"} Stock`}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Grid2 container spacing={2} sx={{ mb: 2 }}>
              <Grid2 item xs={6}>
                <Typography fontWeight="bold">Symbol:</Typography>
              </Grid2>
              <Grid2 item xs={6}>
                <Typography>{stock?.symbol || "N/A"}</Typography>
              </Grid2>

              <Grid2 item xs={6}>
                <Typography fontWeight="bold">Name:</Typography>
              </Grid2>
              <Grid2 item xs={6}>
                <Typography>{realTimeData?.name || "N/A"}</Typography>
              </Grid2>

              <Grid2 item xs={6}>
                <Typography fontWeight="bold">Price:</Typography>
              </Grid2>
              <Grid2 item xs={6}>
                <Typography>${realTimeData?.price || "N/A"}</Typography>
              </Grid2>
            </Grid2>

            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !!error}
        >
          {action === "buy" ? "Buy" : "Sell"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockActionDialog;
