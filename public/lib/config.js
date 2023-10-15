
const config = 
{
  "localhost": // use locale api
  {
    api_client_url: "http://localhost:81/job-woper/australia-southeast1/api/rpc-client",
    api_server_host: "http://localhost:81/job-woper/australia-southeast1/api",
    inactivity_timeout_ms: 12000000,
    signout_timeout_ms: 6000000,
  },
  default:
  {
    api_client_url: "https://api-u7uynejwbq-ts.a.run.app/rpc-client",
    api_server_host: "https://api-u7uynejwbq-ts.a.run.app",
    inactivity_timeout_ms: 1200000000,
    signout_timeout_ms: 60000000,
  },

  get: function()
  {
    return config[window.location.host] || config.default;
  }
};
export default config;