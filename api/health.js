export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const envVars = ["DANIELS_API_BASE", "DANIELS_API_KEY"];
  const loaded = envVars.filter((key) => !!process.env[key]);

  return res.status(200).json({
    ok: true,
    loadedEnvVars: loaded,
  });
}
