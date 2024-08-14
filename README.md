This is the web front-end of the Tindog application, built with NextJS and Firebase.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. This project uses the Firebase emulators by default, you can change this by commenting the Emulators code in the `lib/firebase/config.ts` file.

You should copy your Firebase configuration to a `.env.local` file so it can pick it up and use your Firebase project.

Please refer to the backend project, [Tindog backend](https://github.com/tpiaggio/tindog-backend) for more information. If you want to run this project using the Firebase Emulators, you should start the Emulators on the backend project.

## Deployed on Vercel

This website has been deployed on Vercel, you can check it out [here](https://tindog-frontend-lac.vercel.app/).
