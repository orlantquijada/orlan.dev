export {};
// import { styled, css, CSS } from '@stitches.config'
// import DownloadSvg from '@/components/DownloadSvg'
//
// export default function InstallButton({ css }: { css?: CSS }) {
//   return (
//     <StyledInstallButton css={css}>
//       <DownloadSvg
//         className={footerIconStyles({
//           css: {
//             '@tab': { display: 'none' },
//           },
//         })}
//       />
//
//       <StyledInstallButtonText>Install App</StyledInstallButtonText>
//     </StyledInstallButton>
//   )
// }
//
// const StyledInstallButton = styled('button', {
//   border: 'none',
//   background: 'none',
//   cursor: 'pointer',
//
//   backgroundColor: '$olive4',
//   borderRadius: '0.5rem',
//
//   display: 'flex',
//   alignItems: 'center',
//
//   height: '4rem',
//   px: '1.5rem',
//
//   color: '$olive11',
//   fontWeight: '$bold',
//
//   transition:
//     'background-color 150ms ease, opacity 150ms ease, box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
//
//   '&:focus-within': {
//     '$$ring-offset': '2px',
//     outline: 'none',
//     boxShadow:
//       '0 0 0 $$ring-offset $colors$bg, 0 0 0 calc($$ring-offset + 2px) $colors$olive7',
//   },
//
//   '@tab': {
//     opacity: 0.75,
//
//     '&:hover': {
//       opacity: 1,
//     },
//   },
// })
//
// const StyledInstallButtonText = styled('span', {
//   display: 'none',
//   '@tab': { display: 'block' },
// })
//
// const footerIconStyles = css({
//   size: '1.25rem',
//
//   '@tab': {
//     display: 'none',
//   },
// }
