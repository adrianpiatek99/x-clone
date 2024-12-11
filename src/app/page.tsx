export default function Home() {
  return (
    <div className='flex flex-col gap-9 p-24'>
      <div className='flex flex-wrap items-center justify-center gap-3 [&>div]:size-[100px] [&>div]:rounded'>
        <div className='bg-primary' />
        <div className='bg-background' />
        <div className='bg-foreground' />
        <div className='bg-text-1' />
        <div className='bg-text-2' />
        <div className='bg-border-1' />
      </div>
    </div>
  );
}
