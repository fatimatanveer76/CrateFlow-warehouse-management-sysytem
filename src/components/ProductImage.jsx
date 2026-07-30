import { useState } from 'react';
import { Package } from 'lucide-react';

export default function ProductImage({ src, alt, size = 'md', rounded = 'rounded-lg' }) {
  const [errored, setErrored] = useState(false);

  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-full w-full',
  };

  if (!src || errored) {
    return (
      <div
        className={`flex ${sizes[size]} shrink-0 items-center justify-center ${rounded} bg-navy-100 text-navy-400 dark:bg-navy-700 dark:text-navy-400`}
      >
        <Package size={size === 'lg' ? 32 : 18} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className={`${sizes[size]} shrink-0 ${rounded} object-cover`}
    />
  );
}
