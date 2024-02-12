const CLIENT_ID = "client-id"
export const getClientId = (request: Request) =>
  request.headers[CLIENT_ID] as string | undefined
