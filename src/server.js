/* eslint-disable no-console */
import express from "express"
import AsyncExitHook from "async-exit-hook"
import { CONNECT_DB, GET_DB } from "~/config/mongodb"

const START_SERVER = () => {
  const app = express()

  const hostname = "localhost"
  const port = 8017

  app.get("/", async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())

    res.send("Hello World!")
  })
  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at ${hostname}:${port}/`)
  })
  AsyncExitHook(async (callback) => {
    console.log("Closing MongoDB connection...")
    await GET_DB().close()
    callback()
  })
};
(async () => {
  try {
    console.log("1.Connecting to MongoDB Cloud Atlas...")
    await CONNECT_DB()
    console.log("2.Connected to MongoDB Cloud Atlas successfully")

    START_SERVER()
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(0)
  }
})()
