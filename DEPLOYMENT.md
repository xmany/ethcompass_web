# Deployment and Testing Instructions

## Prerequisites

1. Ensure you have Firebase CLI installed
2. You must be logged into Firebase: `firebase login`
3. Make sure your `.env.local` file has all required Firebase configuration

## Deploy Firebase Functions

1. Deploy the functions to Firebase:
```bash
cd functions
npm run deploy
```

2. To deploy specific functions only:
```bash
firebase deploy --only functions:fetchEthDailyData
firebase deploy --only functions:fetchEthDataManual
firebase deploy --only functions:backfillEthData
```

## Populate Initial Data

Once the functions are deployed, you can populate initial ETH data using the `backfillEthData` function:

1. Get your Firebase project URL from the Firebase Console
2. Call the backfill function to populate the last 30 days:
```bash
curl "https://[YOUR-REGION]-[YOUR-PROJECT-ID].cloudfunctions.net/backfillEthData?days=30"
```

Or use the Firebase Functions shell locally:
```bash
cd functions
npm run shell
# Then in the shell:
backfillEthData({query: {days: "30"}}, {status: () => ({send: console.log})})
```

## Test Manual Data Fetch

You can manually trigger data fetch for specific dates:
```bash
curl "https://[YOUR-REGION]-[YOUR-PROJECT-ID].cloudfunctions.net/fetchEthDataManual?date=2025-08-25"
```

## Local Testing

1. Start the Firebase emulators:
```bash
cd functions
firebase emulators:start --only firestore,functions
```

2. In another terminal, start the Next.js development server:
```bash
npm run dev
```

3. The app should now connect to the local Firebase emulators

## Daily Scheduled Function

The `fetchEthDailyData` function is scheduled to run daily at 00:05 UTC. It will automatically fetch yesterday's ETH data and store it in Firestore.

## Verify Data in Firestore

1. Go to Firebase Console > Firestore Database
2. Look for the `daily_metrics_eth` collection
3. Documents should be named with dates (e.g., "2025-08-26")
4. Each document should contain:
   - timestamp (Firestore Timestamp)
   - timestampISO (ISO date string)
   - price (object with open, high, low, close)
   - volume (number)

## Frontend Verification

1. Open your deployed app or local development server
2. The PriceVolumeChart component should display real ETH data
3. If no data is available, it will fall back to mock data with a message

## Troubleshooting

### Functions not deploying
- Check Node.js version compatibility (functions require Node 22)
- Verify Firebase project configuration

### No data showing in frontend
- Check browser console for errors
- Verify Firestore security rules allow read access
- Check that data exists in Firestore

### API rate limits
- CoinGecko free tier has rate limits
- Consider implementing caching or using a paid API tier for production

## Security Rules

Make sure your Firestore security rules allow reading the `daily_metrics_eth` collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to daily metrics
    match /daily_metrics_eth/{document} {
      allow read: if true;
      allow write: if false; // Only functions should write
    }
  }
}
```
