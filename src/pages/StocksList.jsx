import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  fetchStocks as fetchStocksApi,
  searchStock,
  addStock,
  sellStock,
} from "../services/api";
import StockActionDialog from "../components/StockActionDialog";
import Toast from "../components/Toast";

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [actionType, setActionType] = useState(""); // "buy" or "sell"
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("info");
  const navigate = useNavigate();

  const loadStocks = useCallback(async () => {
    try {
      const response = await fetchStocksApi();
      setStocks(response?.data || []);
    } catch (err) {
      console.error("Error loading stocks:", err);
    }
  }, []);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearch = useCallback(async () => {
    if (searchQuery) {
      try {
        const response = await searchStock(searchQuery);
        setSearchResults(response?.data || []);
      } catch (err) {
        console.error("Error searching stocks:", err);
      }
    }
  }, [searchQuery]);

  const handleStockAction = (stock, action) => {
    setSelectedStock(stock);
    setActionType(action);
  };

  const showToast = (message, severity = "info") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleDialogSubmit = async (data) => {
    try {
      const { symbol, quantity, price, action } = data;
      if (action === "buy") {
        const payload = {
          symbol,
          quantity: Number(quantity),
          price: Number(quantity) * Number(price),
        };
        await addStock(payload);
        setSearchResults([]);
        setSearchQuery("");
        showToast("Stock purchased successfully!", "success");
      } else if (action === "sell") {
        const payload = {
          symbol,
          quantity: Number(quantity),
        };
        const response = await sellStock(payload);
        showToast(`${response?.data?.msg}`, "success");
      }
      setSelectedStock(null);
      loadStocks(); 
    } catch (err) {
      console.error("Error in stock operation:", err);
      showToast(`${err?.response?.data?.msg}`, "error");
    }
  };

  const handleDialogClose = () => {
    setSelectedStock(null);
    setActionType("");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "600px", mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Stocks
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search Stocks"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {searchResults.length > 0 && (
        <Paper elevation={3} sx={{ mt: 4 }}>
          <List>
            {searchResults.map((stock, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={stock.symbol}
                  secondary={`Stock Name: $${stock.name}`}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleStockAction(stock, "buy")}
                >
                  Buy
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <Paper elevation={3} sx={{ mt: 4 }}>
        <List>
          {stocks.length > 0 ? (
            stocks.map((stock, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={stock.symbol}
                  secondary={`Quantity: ${
                    stock.quantity
                  } | Price: $${stock.price.toFixed(1)} | Average Price: $${(
                    stock.price / stock.quantity
                  ).toFixed(1)}`}
                />
                <Button
                  variant="contained"
                  color="success"
                  sx={{ mr: 1 }}
                  onClick={() => handleStockAction(stock, "buy")}
                >
                  Buy
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleStockAction(stock, "sell")}
                >
                  Sell
                </Button>
              </ListItem>
            ))
          ) : (
            <Typography
              variant="body1"
              align="center"
              sx={{ p: 2, color: "text.secondary" }}
            >
              No stocks available. Please search and buy stocks.
            </Typography>
          )}
        </List>
      </Paper>

      <Button
        variant="contained"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        sx={{ display: "block", mx: "auto", mt: 4 }}
      >
        Logout
      </Button>
      <StockActionDialog
        open={!!selectedStock}
        onClose={handleDialogClose}
        stock={selectedStock}
        action={actionType}
        onSubmit={handleDialogSubmit}
      />
      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        severity={toastSeverity}
      />
    </Box>
  );
};

export default Stocks;
