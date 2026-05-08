import localFont from "next/font/local";

export const lato = localFont({
    src: [
        {
            path: '../public/fonts/lato/Lato-Light.woff2',
            weight:'300',
            style:'normal',
        },
        {
            path: '../public/fonts/lato/Lato-Regular.woff2',
            weight:'400',
            style:'normal',
        },
        {
            path: '../public/fonts/lato/Lato-Bold.woff2',
            weight:'700',
            style:'normal',
        }
    ],
    variable: '--lato-font',
})