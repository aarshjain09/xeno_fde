import axios from "axios";

const apiVersion = "2024-01";

const makeClient = (storeDomain, accessToken) => {
  const baseURL = `https://${storeDomain}/admin/api/${apiVersion}`;
  const client = axios.create({
    baseURL,
    headers: {
      "X-Shopify-Access-Token": accessToken,
      "Content-Type": "application/json"
    }
  });
  return client;
};

export const fetchCustomers = async (storeDomain, accessToken) => {
  const client = makeClient(storeDomain, accessToken);

  const res = await client.get("/customers.json", {
    params: { limit: 250 }
  });

  const customers = res.data.customers || [];

  console.log("========== SHOPIFY API DEBUG ==========");
  console.log("TOTAL CUSTOMERS:", customers.length);

  if (customers[0]) {
    console.log("FIRST CUSTOMER -- KEYS:", Object.keys(customers[0]));
    console.log(
      "FIRST CUSTOMER -- FULL OBJECT:",
      JSON.stringify(customers[0], null, 2)
    );
  } else {
    console.log("NO CUSTOMERS FOUND");
  }

  console.log("=======================================");

  return customers;
};



export const fetchProducts = async (storeDomain, accessToken) => {
  const client = makeClient(storeDomain, accessToken);
  const res = await client.get("/products.json?limit=250");
  return res.data.products || [];
};

export const fetchOrders = async (storeDomain, accessToken) => {
  const client = makeClient(storeDomain, accessToken);
  const res = await client.get("/orders.json?status=any&limit=250");
  return res.data.orders || [];
};
