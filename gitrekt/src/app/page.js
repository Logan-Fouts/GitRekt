import SideBar from '@/components/SideBar'
import TopBar from '@/components/TopBar';
import CommitSection from '@/components/CommitSection';

export default function Home() {
  return (
    <div className='w-full'>
      <TopBar />
      <div className='flex justify-between'>
        {/* <SideBar href='https://github.com/Logan-Fouts/PicPurge' reponame={repoName} owner='Logan-Fouts' repodir={repoDir} /> */}
        <SideBar href='https://github.com/Logan-Fouts/Thesis' owner='Logan-Fouts' />
        <CommitSection />
      </div>
    </div>
  );
}
