import React from 'react';
import Image from 'next/image';

const Logo = () => (
  <div className="flex items-center">
    <Image
      src="/logo.svg"
      alt="Logo"
      width={156}
      height={52}
      className="h-11 w-auto sm:h-10 md:h-11"
    />
  </div>
);

export default Logo;
