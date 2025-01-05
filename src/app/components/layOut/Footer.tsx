"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bottom-0 bg-secondary w-full p-[50px] mb-0 h-auto">
      <div className="flex w-full sm:justify-end">
        <div className="flex flex-col sm:flex-row w-[80%] justify-between mx-auto">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl sm:text-3xl font-bold text-white pl-[30%] cursor-pointer"
          >
            מציאון
          </h1>
          <ul className="pb-[5vh]">
            <li
              onClick={() => router.push("/")}
              className="footer-li"
              title="דף הבית"
            >
              דף הבית
            </li>
            <li
              onClick={() => router.push("/user-dashboard")}
              className="footer-li"
              title="איזור אישי"
            >
              איזור אישי
            </li>
            <li
              onClick={() => router.push("/lost-item")}
              className="footer-li"
              title="דיווח על אבידה"
            >
              דיווח על אבידה
            </li>
            <li
              onClick={() => router.push("/found-item")}
              className="footer-li"
              title="דיווח על מציאה"
            >
              דיווח על מציאה
            </li>
          </ul>
          <ul className="flex sm:flex-col justify-between h-full">
            <li
              onClick={() => window.open("/support", "_blank")}
              title="צור קשר"
            >
              <svg
                className="footer-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5l-8-5zm0 12H4V8l8 5l8-5z"
                />
              </svg>
            </li>
            <li
              onClick={() => window.open("https://facebook.com", "_blank")}
              title="פייסבוק"
            >
              <svg
                className="footer-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22 22 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202z"
                />
              </svg>{" "}
            </li>
            <li
              onClick={() => window.open("https://twitter.com", "_blank")}
              title="איקס"
            >
              <svg
                className="footer-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="m17.687 3.063l-4.996 5.711l-4.32-5.711H2.112l7.477 9.776l-7.086 8.099h3.034l5.469-6.25l4.78 6.25h6.102l-7.794-10.304l6.625-7.571zm-1.064 16.06L5.654 4.782h1.803l10.846 14.34z"
                />
              </svg>
            </li>
            <li
              onClick={() => window.open("https://instagram.com", "_blank")}
              title="אינסטגרם"
            >
              <svg
                className="footer-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M12.001 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6m0-2a5 5 0 1 1 0 10a5 5 0 0 1 0-10m6.5-.25a1.25 1.25 0 0 1-2.5 0a1.25 1.25 0 0 1 2.5 0M12.001 4c-2.474 0-2.878.007-4.029.058c-.784.037-1.31.142-1.798.332a2.9 2.9 0 0 0-1.08.703a2.9 2.9 0 0 0-.704 1.08c-.19.49-.295 1.015-.331 1.798C4.007 9.075 4 9.461 4 12c0 2.475.007 2.878.058 4.029c.037.783.142 1.31.331 1.797c.17.435.37.748.702 1.08c.337.336.65.537 1.08.703c.494.191 1.02.297 1.8.333C9.075 19.994 9.461 20 12 20c2.475 0 2.878-.007 4.029-.058c.782-.037 1.308-.142 1.797-.331a2.9 2.9 0 0 0 1.08-.703c.337-.336.538-.649.704-1.08c.19-.492.296-1.018.332-1.8c.052-1.103.058-1.49.058-4.028c0-2.474-.007-2.878-.058-4.029c-.037-.782-.143-1.31-.332-1.798a2.9 2.9 0 0 0-.703-1.08a2.9 2.9 0 0 0-1.08-.704c-.49-.19-1.016-.295-1.798-.331C14.926 4.006 14.54 4 12 4m0-2c2.717 0 3.056.01 4.123.06c1.064.05 1.79.217 2.427.465c.66.254 1.216.598 1.772 1.153a4.9 4.9 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428c.047 1.066.06 1.405.06 4.122s-.01 3.056-.06 4.122s-.218 1.79-.465 2.428a4.9 4.9 0 0 1-1.153 1.772a4.9 4.9 0 0 1-1.772 1.153c-.637.247-1.363.415-2.427.465c-1.067.047-1.406.06-4.123.06s-3.056-.01-4.123-.06c-1.064-.05-1.789-.218-2.427-.465a4.9 4.9 0 0 1-1.772-1.153a4.9 4.9 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.012 15.056 2 14.717 2 12s.01-3.056.06-4.122s.217-1.79.465-2.428a4.9 4.9 0 0 1 1.153-1.772A4.9 4.9 0 0 1 5.45 2.525c.637-.248 1.362-.415 2.427-.465C8.945 2.013 9.284 2 12.001 2"
                />
              </svg>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
