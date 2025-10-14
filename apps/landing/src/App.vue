<script setup>
import { 
  Aperture,
  Blend,
  GitBranchPlus,
  TreePalm,
  Ligature,
  Compass,
} from 'lucide-vue-next';

import BeamBg from './components/Beam.vue';

</script>

<template>
  <div class="relative w-full flex min-h-screen flex-col">
    <div class="flex min-h-screen flex-col">
      <header class="top-[2em] left-0 z-100 absolute w-full h-[60px]">
        <div 
          class="flex justify-between items-center bg-[rgba(255,255,255,0.05)] backdrop-filter backdrop-blur-[10px] mx-auto my-0 px-6 border rounded-[50px] w-[90%] md:w-[60%] h-full"
          style="backdrop-filter: blur(10px); box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 30px; border-color: #fff3;"
        >
          <div class="flex w-full h-14 items-center">
            <div class="flex w-full justify-between items-center">
              <a class="hidden items-center space-x-2 md:flex" href="/">
                <span class="hidden font-bold sm:inline-block">
                  <img src="https://res.cloudinary.com/dybz0bvui/image/upload/v1756861224/logo_bmrely.png" alt="Logo" width="80px">
                </span>
              </a>
              <div class="hidden gap-2 md:flex">
                <a href="https://nupthale.github.io/lumi/" target="_blank" class="head-nav-link text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <g clip-path="url(#a)">
                      <path fill-rule="evenodd" d="M12.015.044A12.003 12.003 0 0 0 8.221 23.44c.596.11.817-.266.817-.582v-2.041c-3.337.736-4.045-1.607-4.045-1.607a3.213 3.213 0 0 0-1.333-1.76c-1.084-.738.088-.738.088-.738a2.528 2.528 0 0 1 1.835 1.238 2.565 2.565 0 0 0 3.492 1.002 2.55 2.55 0 0 1 .737-1.606c-2.667-.302-5.467-1.334-5.467-5.931a4.642 4.642 0 0 1 1.23-3.22 4.37 4.37 0 0 1 .118-3.176s1.01-.324 3.301 1.23c1.968-.54 4.045-.54 6.013 0 2.291-1.554 3.293-1.23 3.293-1.23a4.347 4.347 0 0 1 .126 3.176 4.642 4.642 0 0 1 1.23 3.22c0 4.612-2.807 5.622-5.482 5.894a2.838 2.838 0 0 1 .818 2.21v3.294c0 .39.214.693.825.582A12.01 12.01 0 0 0 12.015 0v.044Z" clip-rule="evenodd"></path>
                    </g>
                    <defs>
                      <clipPath id="a">
                        <path d="M0 0h24v24H0z"></path>
                      </clipPath>
                    </defs>
                  </svg>
                </a>

                <div class="head-nav-link flex items-center text-[14px] text-white">Home</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main class="relative flex-1">
        <div class="bg-container">
          <BeamBg
            :beam-width="2"
            :beam-height="15"
            :beam-number="12"
            :light-color="'#ffffff'"
            :speed="2"
            :noise-intensity="1.75"
            :scale="0.2"
            :rotation="30"
          />
        </div>
        <section class="relative overflow-hidden" style="margin-top: 160px">
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30">
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-3xl animate-blob"></div>
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-3xl animate-blob animation-delay-2000"></div>
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-blue-400 blur-3xl animate-blob animation-delay-4000"></div>
            </div>
          </div>
          <div class="relative flex items-center flex-col justify-center mx-auto px-4 text-center">
            <span class="flex justify-center items-center bg-[rgba(255,244,255,0.05)] backdrop-filter backdrop-blur-[10px] px-4 border border-[rgba(255,255,255,0.2)] rounded-[50px] w-auto h-[34px] font-medium text-[12px] text-white md:text-[14px]">Help you complete document editing in minutes</span>
            <h1 class="mt-8 mb-8 max-w-[28ch] font-bold text-[clamp(2rem,4vw,2.6rem)] text-white text-center leading-[1.2] tracking-[-2px]">
              Local-first personal knowledge management system<br>
              <span class="mt-4 text-[clamp(2rem,2vw,2rem)] bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400" style="background: radial-gradient(95% 55.37% at 95% 28.12%,#8d55ed 0,#4752e6 100%); background-clip: text; color: transparent">
                notion-like & open source
              </span>
            </h1>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8" style="opacity: 1; will-change: auto; transform: none;">
              <a class="cursor-pointer" href="https://lumidoc-res.oss-cn-beijing.aliyuncs.com/0.0.1/Lumi-1.0.0-alpha.2.dmg" target="_blank">
                <img src="https://res.cloudinary.com/dybz0bvui/image/upload/v1756861300/macappstore_al6pay.svg" alt="macappstore" style="height: 52px;">
              </a>
              <a class="cursor-pointer" href="https://lumidoc-res.oss-cn-beijing.aliyuncs.com/0.0.1/Lumi-Setup-1.0.0-alpha.2.exe" target="_blank">
                <img src="https://res.cloudinary.com/dybz0bvui/image/upload/v1760403911/winstore_iylxng.png" alt="winstore" style="height: 52px;">
              </a>
              <a class="cursor-pointer" href="https://lumidoc-res.oss-cn-beijing.aliyuncs.com/0.0.1/lumi-linux.zip" target="_blank">
                <img src="https://res.cloudinary.com/dybz0bvui/image/upload/v1760422601/linuxstore_mpbhix.png" alt="linuxstore" style="height: 52px;">
              </a>
            </div>
          <div class="max-w-5xl mx-auto">
            <div class="relative rounded-xl overflow-hidden" style="opacity: 1; will-change: auto; transform: none; box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
              <div class="relative aspect-video" style="background: #ffffff8a;">
                <img src="https://res.cloudinary.com/dybz0bvui/image/upload/v1756861222/appshot_zufhfb.png" class="w-full" />
                </div>
              </div>
            </div>
          </div>

          <div class="my-24 max-w-5xl mx-auto">
            <div class="featuresTitle font-display effect-font-styling text-[3rem] md:text-[3.5rem] tracking-tighter leading-[120%] effect-font-gradient relative z-20 mb-12 max-w-md">Explore More features, <br />not just an editor</div>
            <div class="relative text-white z-20 mt-12 grid w-full grid-cols-1 gap-12 sm:grid-cols-2 md:flex-row md:gap-20 lg:grid-cols-3">
              <div class="flex w-full flex-col gap-3 md:gap-2">
                <h4 class="mb-2 flex items-center font-display effect-font-styling text-xl text-slate-12 leading-[32px] md:leading-none">
                  <div class="mr-4 align-center border-slate-6 text-slate-12 group-data-[state=active]:text-green-9 relative flex h-10 w-10 justify-center overflow-hidden rounded-xl p-2 transition-all duration-150 ease-in-out md:border" style="background: linear-gradient(to bottom, rgba(31, 163, 130, 0.3) 10%, transparent 100%)">
                    <Aperture stroke="#1fa382" />
                  </div>
                  Rich Text Editor
                </h4>
                <div style="color: #a1a4a5;" class="text-sm leading-[1.6] font-normal">Easily create and format documents with a powerful rich text editor. Enjoy intuitive editing tools, seamless styling options, and a user-friendly interface for all your writing needs.</div>
              </div>

              <div class="flex w-full flex-col gap-3 md:gap-2">
                <h4 class="mb-2 flex items-center font-display effect-font-styling text-xl text-slate-12 leading-[32px] md:leading-none">
                  <div class="mr-4 align-center border-slate-6 text-slate-12 group-data-[state=active]:text-green-9 relative flex h-10 w-10 justify-center overflow-hidden rounded-xl bg-gradient-to-bl from-white/[6%] p-2 transition-all duration-150 ease-in-out group-data-[state=active]:from-white/10 md:border" style="background: linear-gradient(to bottom, rgba(245, 158, 11, 0.3) 10%, transparent 100%)">
                    <Blend stroke="#f59e0b" />
                  </div>
                  Local First App
                </h4>
                <div style="color: #a1a4a5;" class="text-sm leading-[1.6] font-normal">Your data is stored and managed directly on your device, ensuring privacy, speed, and reliability. Work offline anytime without worrying about losing access to your documents.</div>
              </div>


              <div class="flex w-full flex-col gap-3 md:gap-2">
                <h4 class="mb-2 flex items-center font-display effect-font-styling text-xl text-slate-12 leading-[32px] md:leading-none">
                  <div class="mr-4 align-center border-slate-6 text-slate-12 group-data-[state=active]:text-green-9 relative flex h-10 w-10 justify-center overflow-hidden rounded-xl bg-gradient-to-bl from-white/[6%] p-2 transition-all duration-150 ease-in-out group-data-[state=active]:from-white/10 md:border" style="background: linear-gradient(to bottom, rgba(242, 85, 51, 0.3) 10%, transparent 100%)">
                    <GitBranchPlus stroke="#f25533" />
                  </div>
                  Flexible schema design
                </h4>
                <div style="color: #a1a4a5;" class="text-sm leading-[1.6] font-normal">Easily customize data structures to fit your unique requirements. Adapt fields, relationships, and formats for any workflow, making your editor truly versatile and scalable.</div>
              </div>


              <div class="flex w-full flex-col gap-3 md:gap-2">
                <h4 class="mb-2 flex items-center font-display effect-font-styling text-xl text-slate-12 leading-[32px] md:leading-none">
                  <div class="mr-4 align-center border-slate-6 text-slate-12 group-data-[state=active]:text-green-9 relative flex h-10 w-10 justify-center overflow-hidden rounded-xl bg-gradient-to-bl from-white/[6%] p-2 transition-all duration-150 ease-in-out group-data-[state=active]:from-white/10 md:border" style="background: linear-gradient(to bottom, rgba(151, 71, 255, 0.3) 10%, transparent 100%)">
                    <TreePalm stroke="#9747FF" />
                  </div>
                  Collaborative
                </h4>
                <div style="color: #a1a4a5;" class="text-sm leading-[1.6] font-normal">Work together in real time with your team. Share documents, edit simultaneously, and keep everyone on the same page for seamless collaboration.</div>
              </div>

              <div class="flex w-full flex-col gap-3 md:gap-2">
                <h4 class="mb-2 flex items-center font-display effect-font-styling text-xl text-slate-12 leading-[32px] md:leading-none">
                  <div class="mr-4 align-center border-slate-6 text-slate-12 group-data-[state=active]:text-green-9 relative flex h-10 w-10 justify-center overflow-hidden rounded-xl bg-gradient-to-bl from-white/[6%] p-2 transition-all duration-150 ease-in-out group-data-[state=active]:from-white/10 md:border" style="background: linear-gradient(to bottom, rgba(68, 255, 164, 0.3) 10%, transparent 100%)">
                    <Ligature stroke="#44ffa49e" />
                  </div>
                  Markdown Support
                </h4>
                <div style="color: #a1a4a5;" class="text-sm leading-[1.6] font-normal">Write and format documents using Markdown syntax. Effortlessly convert your notes into rich text and enjoy a smooth editing experience for technical and creative content.</div>
              </div>

              <div class="flex w-full flex-col gap-3 md:gap-2">
                <h4 class="mb-2 flex items-center font-display effect-font-styling text-xl text-slate-12 leading-[32px] md:leading-none">
                  <div class="mr-4 align-center border-slate-6 text-slate-12 group-data-[state=active]:text-green-9 relative flex h-10 w-10 justify-center overflow-hidden rounded-xl bg-gradient-to-bl from-white/[6%] p-2 transition-all duration-150 ease-in-out group-data-[state=active]:from-white/10 md:border" style="background: linear-gradient(to bottom, rgba(255, 205, 42, 0.3) 10%, transparent 100%)">
                    <Compass stroke="#FFCD2A" />
                  </div>
                  AI Features
                </h4>
                <div style="color: #a1a4a5;" class="text-sm leading-[1.6] font-normal">Enhance your workflow with intelligent tools powered by AI. Automate tasks, generate content, and get smart suggestions to boost productivity and creativity.</div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.header {
    backdrop-filter: blur(10px);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 30px;
}

.bg-container {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

.head-nav-link {
  position: relative;
  padding: 10px 6px;
  cursor: pointer;
}

.head-nav-link:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(255,255,255,0.2);
  border-radius: 0.4rem;
  transform: scale(40%);
  opacity: 0;
}

.head-nav-link:hover:before {
  opacity: 1;
  transform: scale(100%);
  border-radius: 0.6rem;
}

.featuresTitle {
  -webkit-text-fill-color: transparent;
  background: linear-gradient(to bottom right, #fff 30%, #ffffff80);
  -webkit-background-clip: text;
  background-clip: text;
}

.features {

}
</style>
