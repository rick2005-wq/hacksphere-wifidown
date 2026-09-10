import "./globals.css";

export const metadata = {
    title: "ContractGuard",
    description: "Smart contract vulnerability detection and AI-assisted patching",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
