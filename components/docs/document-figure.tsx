"use client";

import { Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useModalBehavior } from "@/components/use-modal-behavior";

type DocumentFigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  loading?: "eager" | "lazy";
  zoom?: boolean;
};

export function DocumentFigure({
  src,
  alt,
  width,
  height,
  caption,
  loading,
  zoom = true,
}: DocumentFigureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = `${useId()}-title`;
  const closeLightbox = useCallback(() => setIsOpen(false), []);

  useModalBehavior({
    dialogRef,
    isOpen,
    onClose: closeLightbox,
    triggerRef,
  });

  const image = (
    <Image
      alt={alt}
      height={height}
      loading={loading}
      sizes="(max-width: 767px) calc(100vw - 40px), 760px"
      src={src}
      width={width}
    />
  );

  return (
    <>
      <figure className="article-figure">
        {zoom ? (
          <button
            aria-label={`Ampliar imagem: ${alt}`}
            className="article-figure__trigger"
            onClick={() => setIsOpen(true)}
            ref={triggerRef}
            type="button"
          >
            {image}
            <span aria-hidden="true">
              <Maximize2 size={16} />
            </span>
          </button>
        ) : (
          image
        )}
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>

      {isOpen
        ? createPortal(
            <dialog
              aria-labelledby={titleId}
              className="image-lightbox"
              onMouseDown={(event) => {
                if (event.currentTarget === event.target) closeLightbox();
              }}
              ref={dialogRef}
            >
              <h2 className="sr-only" id={titleId}>
                {caption ?? alt}
              </h2>
              <button
                aria-label="Fechar imagem ampliada"
                className="icon-button image-lightbox__close"
                onClick={closeLightbox}
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
              <div className="image-lightbox__content">
                <Image
                  alt={alt}
                  height={height}
                  loading={loading}
                  sizes="94vw"
                  src={src}
                  width={width}
                />
                {caption ? <p>{caption}</p> : null}
              </div>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
