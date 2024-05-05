import * as React from 'react';

interface Props {

}

const AccountNotFound: React.FC<Props> = ({ }) => {
 return (
 <div className='w-full text-white h-screen text-center'>
    <p className='mt-[20%]'>Error loading user data, click <a href="/login" className='text-cyan-400 underline'>here</a> to return to login page.</p>
 </div>
 )
}

export default AccountNotFound