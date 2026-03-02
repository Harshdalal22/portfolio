import Script from 'next/script';

export default function Home() {
  return (
    <main className="w-full h-screen relative bg-black flex flex-col items-center justify-center">
      <Script
        type="module"
        src="https://unpkg.com/@splinetool/viewer@1.12.61/build/spline-viewer.js"
        strategy="lazyOnload"
      />

      {/* 
        We use a div with dangerouslySetInnerHTML because Next.js/React might 
        complain about custom web components like <spline-viewer> 
      */}
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{
          __html: `<spline-viewer url="https://prod.spline.design/3Vl28P91MXcvHtOK/scene.splinecode"></spline-viewer>`
        }}
      />
    </main>
  );
}
