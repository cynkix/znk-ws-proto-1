import { RefObject, useEffect, useRef } from 'react';

// Stack of open modals: only the topmost one reacts to Escape, and page scroll
// stays locked until the last one closes (e.g. contact modal opened on top of
// an offer modal).
const modalStack: symbol[] = [];
let overflowBeforeLock = '';

/**
 * Shared modal behaviour: Escape closes, page scroll is locked behind the
 * modal, focus moves into the dialog and returns to the trigger on close.
 * Not a full focus trap: Tab can still leave the dialog.
 */
export function useModalBehavior(
  isOpen: boolean,
  onClose: () => void,
  dialogRef?: RefObject<HTMLElement | null>,
) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const id = Symbol('modal');
    const previouslyFocused = document.activeElement as HTMLElement | null;

    if (modalStack.length === 0) {
      overflowBeforeLock = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    modalStack.push(id);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalStack[modalStack.length - 1] === id) {
        onCloseRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    dialogRef?.current?.focus({ preventScroll: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      modalStack.splice(modalStack.indexOf(id), 1);
      if (modalStack.length === 0) {
        document.body.style.overflow = overflowBeforeLock;
      }
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [isOpen, dialogRef]);
}
