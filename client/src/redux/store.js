import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import variantReducer from "./slices/variantSlice";
import orderReducer from "./slices/orderSlice";
import addressReducer from "./slices/addressSlice";
import contactReducer from "./slices/contactSlice";
import requestCallReducer from "./slices/reqCallbackSlice";
import cartReducer from "./slices/cartSlice";
import reviewReducer from "./slices/reviewSlice";
import healthGainerReducer from "./slices/healthGainerSlice";
import imageReducer from "./slices/header-slice/imageSlice";
import benefitsReducer from "./slices/benefit-slice/index";
import supplementsReducer from "./slices/supplement-slice/index";
import videosReducer from "./slices/video-carousel-slice/index";
import dealsReducer from "./slices/deal-slice/index";
import newsReducer from "./slices/news-slice/index";
import advantageReducer from "./slices/why-choose/advantage-slice/index";
import featureReducer from "./slices/why-choose/feature-slice/index";
import mediaReportsReducer from "./slices/mediaReport-slice/index";
import distributorshipReducer from "./slices/distributorship/distributorshipSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    product: productReducer,
    variant: variantReducer,
    orders: orderReducer,
    address: addressReducer,
    contact: contactReducer,
    requestCall: requestCallReducer,
    cart: cartReducer,
    review: reviewReducer,
    healthGainer: healthGainerReducer,

    distributorship: distributorshipReducer,
    headerSlider: imageReducer,
    benefits: benefitsReducer,
    supplements: supplementsReducer,
    videos: videosReducer,
    deals: dealsReducer,
    news: newsReducer,
    advantages: advantageReducer,
    features: featureReducer,
    mediaReports: mediaReportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export { store, persistor };
