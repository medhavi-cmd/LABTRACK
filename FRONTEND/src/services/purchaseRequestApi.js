import { toQueryString } from "../hooks/useListQuery";
import { request } from "./teamApi";


//  GET TEAM DETAILS FOR REQUEST FORM
export const getRequestFormDetails = () =>
  request("/purchase-requests/form-details");


//  SUBMIT PURCHASE REQUEST
export const submitPurchaseRequest = (payload) =>
  request("/purchase-requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });


//  GET ALL MY PURCHASE REQUESTS

// Search, filter and sort are resolved by the API (purchaseRequestService.js).
export const getMyPurchaseRequests = (params = {}, signal) =>
  request(`/purchase-requests/my-requests${toQueryString(params)}`, { signal });