# Deployment Guide

This guide will help you deploy the Event Management System to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Render account (sign up at [render.com](https://render.com))
- MongoDB Atlas account for production database
- Google OAuth credentials
- Stripe account for payments

## Backend Deployment (Render)

### 1. Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with password
4. Whitelist all IP addresses (0.0.0.0/0) for Render
5. Get your connection string (replace `<password>` with your actual password)

### 2. Deploy to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `eventmanagement-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

6. Add Environment Variables:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/eventmanagement
   SECRET_KEY=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=https://your-frontend-url.vercel.app
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

7. Click "Create Web Service"
8. Wait for deployment to complete
9. Copy your backend URL (e.g., `https://eventmanagement-backend.onrender.com`)

### 3. Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 Client
3. Add authorized redirect URIs:
   ```
   https://your-backend-url.onrender.com/api/auth/callback
   ```

## Frontend Deployment (Vercel)

### 1. Prepare Environment Variables

Create a `.env.production` file in the `frontend` directory:

```env
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
REACT_APP_ENABLE_VISUAL_EDITS=false
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name? `eventmanagement-frontend`
   - Directory? `./`
   - Override settings? **N**

5. Deploy to production:
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add Environment Variables:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   REACT_APP_ENABLE_VISUAL_EDITS=false
   ```

6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your frontend URL (e.g., `https://eventmanagement.vercel.app`)

### 3. Update Backend CORS

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. The backend will automatically restart

## Post-Deployment Steps

### 1. Test the Application

1. Visit your Vercel URL
2. Test user registration and login
3. Test Google OAuth login
4. Create a test event
5. Test booking with Stripe (use test card: 4242 4242 4242 4242)

### 2. Update Stripe Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers → Webhooks
3. Add endpoint:
   ```
   https://your-backend-url.onrender.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`

### 3. Set Up Custom Domain (Optional)

#### For Frontend (Vercel):
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

#### For Backend (Render):
1. Go to your service settings in Render
2. Navigate to "Custom Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Environment Variables Reference

### Backend (.env)
```env
MONGODB_URL=mongodb+srv://...
SECRET_KEY=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-frontend-url.vercel.app
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Frontend (.env.production)
```env
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
REACT_APP_ENABLE_VISUAL_EDITS=false
```

## Troubleshooting

### Backend Issues

**Problem**: 502 Bad Gateway
- **Solution**: Check Render logs, ensure all environment variables are set correctly

**Problem**: CORS errors
- **Solution**: Verify `FRONTEND_URL` in backend environment variables matches your Vercel URL exactly

**Problem**: Database connection failed
- **Solution**: Check MongoDB Atlas IP whitelist includes 0.0.0.0/0

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Verify `REACT_APP_BACKEND_URL` is set correctly and includes `https://`

**Problem**: OAuth not working
- **Solution**: Check Google OAuth redirect URIs include your backend URL

**Problem**: Stripe checkout not working
- **Solution**: Verify Stripe publishable key is correct and webhook is configured

## Monitoring

### Render
- View logs: Render Dashboard → Your Service → Logs
- Monitor metrics: Render Dashboard → Your Service → Metrics

### Vercel
- View deployments: Vercel Dashboard → Your Project → Deployments
- Monitor analytics: Vercel Dashboard → Your Project → Analytics

## Scaling

### Free Tier Limitations
- **Render**: Service spins down after 15 minutes of inactivity
- **Vercel**: 100GB bandwidth per month

### Upgrade Options
- **Render**: Upgrade to paid plan for always-on service
- **Vercel**: Upgrade for more bandwidth and team features

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] MongoDB Atlas has proper authentication
- [ ] Google OAuth credentials are production-ready
- [ ] Stripe is in live mode (not test mode)
- [ ] CORS is configured correctly
- [ ] HTTPS is enabled (automatic on Vercel and Render)
- [ ] Sensitive data is not committed to Git

## Support

For issues:
1. Check Render logs for backend errors
2. Check Vercel deployment logs for frontend errors
3. Review browser console for client-side errors
4. Check MongoDB Atlas for database issues

---

**Congratulations!** Your Event Management System is now live! 🎉
