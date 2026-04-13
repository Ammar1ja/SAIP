'use client';

import React, { useState } from 'react';
import { RegulationDetail } from '@/lib/drupal/services/systems-and-regulations-detail.service';
import { Label } from '@/components/atoms/Label';
import Link from 'next/link';
import { PDFViewer } from '@/components/molecules/PDFViewer/PDFViewer';

interface RegulationDetailContentProps {
  regulation: RegulationDetail;
  relatedRegulations?: Array<{
    title: string;
    href: string;
  }>;
}

export function RegulationDetailContent({
  regulation,
  relatedRegulations = [],
}: RegulationDetailContentProps) {
  // Get PDF URL for viewing (use secondaryButtonHref for view, primaryButtonHref for download)
  const pdfViewUrl = regulation.secondaryButtonHref || regulation.primaryButtonHref;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* PDF Viewer */}
          <div className="w-full">
            {pdfViewUrl ? (
              <PDFViewer
                src={pdfViewUrl}
                title={regulation.title}
                downloadUrl={regulation.primaryButtonHref}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-600">
                <p>No document available for viewing.</p>
              </div>
            )}
          </div>

          {/* Metadata section below PDF viewer */}
          <div className="w-full">
            <div className=" p-6 space-y-6">
              {/* Category */}
              {regulation.category && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Category</h3>
                  <Label className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                    {regulation.category}
                  </Label>
                </div>
              )}

              {/* Type */}
              {regulation.type && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Type:</h3>
                  <p className="text-gray-700">{regulation.type}</p>
                </div>
              )}

              {/* Other Systems & regulations */}
              {relatedRegulations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Other Systems & regulations
                  </h3>
                  <ul className="space-y-3">
                    {relatedRegulations.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-primary-600 hover:text-primary-700 hover:underline text-sm"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
