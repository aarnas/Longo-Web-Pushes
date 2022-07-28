# Push notifications server

1.  ```
    npm i
    ```

2.  Generate your secrets with:

    ```
    ./node_modules/.bin/web-push generate-vapid-keys
    ```

3.  Replace the `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` with the generated keys.

- in public/index.js `VAPID_PUBLIC_KEY`
- in src/web-pushes.js `vapidDetails.publicKey` and `vapidDetails.privateKey`

4. ```
   npm start
   ```
