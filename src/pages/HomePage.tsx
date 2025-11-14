// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';

// Import your images (make sure these paths are correct)
import dashboardImage from '../assets/images/dashboard.png.jpg'; 
import piggyBankImage from '../assets/images/piggy-bank.png.jpg'; 


const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 1. Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-green-600">
              ExpenseTracker
            </Link>
            
            {/* Nav Links */}
            <nav className="flex items-center space-x-6">
              <Link to="/" className="font-semibold text-gray-600 hover:text-green-600">
                Home
              </Link>
              {/* NEW: Link to How It Works */}
              <a href="#how-it-works" className="text-gray-600 hover:text-green-600">
                How It Works
              </a>
              <a href="#about" className="text-gray-600 hover:text-green-600">
                About
              </a>
              <a href="#faq" className="text-gray-600 hover:text-green-600">
                FAQ
              </a>
              
              {/* Call to Action Buttons */}
              <Link
                to="/auth"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* 2. Hero Section with Green Gradient */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-24 text-white">
          <div className="container mx-auto flex flex-col items-center px-6 text-center md:flex-row md:text-left">
            <div className="md:w-1/2">
              <h1 className="text-5xl font-bold">
                Take control of your
                <span className="text-green-300"> personal finances.</span>
              </h1>
              <p className="mt-6 text-lg text-emerald-100">
                Stop wondering where your money went. Our Expense Tracker
                helps you visualize spending, manage budgets, and make
                smarter financial decisions.
              </p>
              <Link
                to="/auth"
                className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-lg font-semibold text-green-600 shadow-lg hover:bg-gray-100"
              >
                Get Started for Free
              </Link>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
              <img
                src={dashboardImage}
                alt="Financial Dashboard on Laptop"
                className="w-full max-w-md rounded-lg shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* 3. Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              All the tools you need
            </h2>
            <p className="mt-4 text-center text-gray-600">
              From logging expenses to visualizing income streams.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold">Track & Categorize</h3>
                <p className="mt-2 text-gray-600">
                  Quickly add expenses or income. Assign them to categories
                  like "Groceries," "Salary," or "Utilities" to see exactly
                  where your money is going.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3m-16.5 0h16.5m-16.5 0H3.75m0 0v.01M6 16.5h12M6 16.5H6.75m11.25 0h.75m-1.5 0v.01M6 16.5v.01M6 16.5v0" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold">Visualize Your Data</h3>
                <p className="mt-2 text-gray-600">
                  Our main dashboard gives you a real-time view of your
                  balance, total income, and total expenses. No more
                  spreadsheets.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-semibold">Access Anywhere</h3>
                <p className="mt-2 text-gray-600">
                  With our secure, deployed application, you can log in and
                  manage your finances from any device, anywhere in the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. How It Works Section (NEW) */}
        <section id="how-it-works" className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Get started in 3 simple steps
            </h2>
            <div className="relative mt-12">
              {/* Dotted line connecting the steps */}
              <div className="absolute left-1/2 top-10 -ml-px h-full w-0.5 border-l-2 border-dashed border-gray-300 md:block" aria-hidden="true"></div>

              <div className="relative space-y-12">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white shadow-lg">1</div>
                  <div className="mt-6 md:mt-0 md:ml-8">
                    <h3 className="text-xl font-semibold text-gray-900">Sign Up & Create Categories</h3>
                    <p className="mt-2 text-gray-600">
                      Create your free account. Then, set up your personal categories like "Salary" (Income) and "Groceries" (Expense).
                    </p>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white shadow-lg">2</div>
                  <div className="mt-6 md:mt-0 md:ml-8">
                    <h3 className="text-xl font-semibold text-gray-900">Log Your Transactions</h3>
                    <p className="mt-2 text-gray-600">
                      Quickly add transactions as they happen. Select your category, enter the amount, and set the date.
                    </p>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white shadow-lg">3</div>
                  <div className="mt-6 md:mt-0 md:ml-8">
                    <h3 className="text-xl font-semibold text-gray-900">See Your Financial Story</h3>
                    <p className="mt-2 text-gray-600">
                      Watch your dashboard update in real-time. See your Total Income, Total Expenses, and new balance instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. About Section */}
        <section id="about" className="bg-white py-20">
          <div className="container mx-auto flex flex-col items-center px-6 md:flex-row">
            <div className="md:w-1/2 flex justify-center">
              <img
                src={piggyBankImage}
                alt="Money Saving Piggy Bank"
                className="w-full max-w-sm rounded-lg shadow-xl"
              />
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Your Money, Made Simple
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Managing personal finances can be overwhelming. It's easy
                to lose track of daily spending and even harder to know if
                you're on track to meet your savings goals.
              </p>
              <p className="mt-4 text-gray-600">
                That's why we built ExpenseTracker. We believe financial
                wellness starts with **clarity**. Our app is a simple,
                powerful tool designed to give you back control.
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>
                  <span className="font-semibold text-green-600">See Everything:</span>
                  Log both your income (like 'Salary') and your expenses
                  (like 'Groceries') in just a few clicks.
                </li>
                <li>
                  <span className="font-semibold text-green-600">Visualize Habits:</span>
                  Our dashboard instantly shows your 'Total Income' vs.
                  'Total Expenses' so you know *exactly* where you stand.
                </li>
                <li>
                  <span className="font-semibold text-green-600">Achieve Goals:</span>
                  By understanding your habits, you can build a budget,
                  cut back, and start saving for what truly matters.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Testimonials Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Trusted by users everywhere
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {/* Testimonial 1 */}
              <div className="rounded-lg bg-white p-8 shadow-lg">
                <p className="text-gray-600">
                  "This app is a game-changer. I finally figured out that I
                  was spending way too much on 'Transport'. Seeing the
                  numbers on the dashboard made it real."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                    JD
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">Jane D.</p>
                    <p className="text-sm text-gray-500">Freelance Designer</p>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="rounded-lg bg-white p-8 shadow-lg">
                <p className="text-gray-600">
                  "As someone who gets paid from multiple sources, the
                  'Income' category is amazing. I added 'Salary' and
                  'Freelance Gigs', and now I can track my total income
                  perfectly. The balance is always 100% accurate."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                    MS
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">Mark S.</p>
                    <p className="text-sm text-gray-500">Software Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ Section */}
        <section id="faq" className="bg-white py-20">
          <div className="container mx-auto max-w-3xl px-6">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="mt-12 space-y-8">
              {/* FAQ 1 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Is my financial data secure?
                </h3>
                <p className="mt-2 text-gray-600">
                  **Yes.** We take security very seriously. Your account is
                  protected by password encryption and secure JWT (JSON Web
                  Token) authentication. Your financial data is stored in a
                  private, protected database.
                </p>
              </div>
              {/* FAQ 2 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Can I track both income and expenses?
                </h3>
                <p className="mt-2 text-gray-600">
                  **Absolutely.** This is a core feature of the app. You can
                  create categories for both "Income" (like "Salary" or
                  "Freelance") and "Expense" (like "Groceries" or "Rent").
                  The dashboard will then show you the complete picture.
                </p>
              </div>
              {/* FAQ 3 */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Can I use this on my phone?
                </h3>
                <p className="mt-2 text-gray-600">
                  **Yes.** The application is fully responsive and designed to
                  work on any device (desktop, tablet, or phone), so you
                  can log transactions and check your balance on the go.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Final Call to Action (CTA) Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-20 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold">
              Ready to take control?
            </h2>
            <p className="mt-4 text-lg text-emerald-100">
              Stop guessing and start tracking. Sign up for free and get
              clarity on your finances today.
            </p>
            <Link
              to="/auth"
              className="mt-8 inline-block rounded-full bg-white px-10 py-4 text-lg font-semibold text-green-600 shadow-lg hover:bg-gray-100"
            >
              Start for Free
            </Link>
          </div>
        </section>

      </main>

      {/* 9. Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            © 2025 Expense Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;