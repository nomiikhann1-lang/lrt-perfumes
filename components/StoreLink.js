import Link from 'next/link';
// Dynamic pages render the catalogue. Avoid speculative rendering of every
// product, collection and footer route on resource-constrained hosting.
export default function StoreLink(props){return <Link prefetch={false} {...props}/>;}
