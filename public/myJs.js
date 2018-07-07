import { chatManager, tokenProvider } from '@pusher/chatkit'
const tokenProvider = new Chatkit.TokenProvider
(
  {
    url: `https://us1.pusherplatform.io/services/chatkit_token_provider/v1/07b8c552-be6e-4e11-acc5-c4e864089aaf/token`
  }
)

const chatManager = new Chatkit.ChatManager({
  instanceLocator: "v1:us1:07b8c552-be6e-4e11-acc5-c4e864089aaf",
  userId: 'virat18',
  tokenProvider
})

  chatManager.connect()
  .then(currentUser => {
  currentUser.createRoom({
    name: 'Sindhu',
    private: false,
    addUserIds: ['virat18']
  })
    console.log('Successful connection', currentUser)
  })
  .catch(err => {
    console.log('Error on connection', err)
  })
