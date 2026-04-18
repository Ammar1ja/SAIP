'use client';

import React, { useState, useEffect } from 'react';
import { GlossaryTable } from '@/components/organisms/GlossaryTable/GlossaryTable';
import { GlossaryTabs } from '@/components/molecules/GlossaryTabs/GlossaryTabs';
import { LetterFilterGroup } from '@/components/molecules/LetterFilterGroup/LetterFilterGroup';
import { ARABIC_LETTERS, ENGLISH_LETTERS } from './IPGlossary.data';
import Pagination from '@/components/atoms/Pagination';
import { Table, type TableColumn } from '@/components/organisms/Table';
import { GlossaryTermData, AcronymData } from '@/lib/drupal/services/ip-glossary.service';
import { useTranslations } from 'next-intl';

const ITEMS_PER_PAGE = 10;
const ARABIC_TOGGLE_STORAGE_KEY = 'ipGlossary_arabicToggle';

interface IPGlossarySectionProps {
  glossaryTerms: GlossaryTermData[];
  acronyms: AcronymData[];
}
export const glossaryTermsData: GlossaryTermData[] = [
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
  {
    english: 'IP Address',
    arabic: 'عنوان IP',
    description: 'A unique identifier assigned to a device on a network.',
  },
  {
    english: 'Subnet Mask',
    arabic: 'قناع الشبكة الفرعية',
    description: 'Defines the network and host portions of an IP address.',
  },
  {
    english: 'Gateway',
    arabic: 'البوابة',
    description: 'A node that routes traffic between different networks.',
  },
  {
    english: 'DNS',
    arabic: 'نظام أسماء النطاقات',
    description: 'Translates domain names into IP addresses.',
  },
  {
    english: 'DHCP',
    arabic: 'بروتوكول التهيئة التلقائية',
    description: 'Automatically assigns IP addresses to devices.',
  },
  {
    english: 'MAC Address',
    arabic: 'عنوان MAC',
    description: 'A hardware identifier for network interfaces.',
  },
  {
    english: 'Firewall',
    arabic: 'جدار الحماية',
    description: 'Security system that monitors and controls network traffic.',
  },
  {
    english: 'VPN',
    arabic: 'الشبكة الافتراضية الخاصة',
    description: 'Creates a secure connection over a public network.',
  },
  {
    english: 'SSL',
    arabic: 'طبقة المنافذ الآمنة',
    description: 'Protocol for encrypting internet communications.',
  },
  {
    english: 'TLS',
    arabic: 'أمن طبقة النقل',
    description: 'Modern version of SSL for secure data transmission.',
  },
  {
    english: 'Packet',
    arabic: 'حزمة بيانات',
    description: 'A unit of data transmitted over a network.',
  },
  { english: 'Latency', arabic: 'زمن التأخير', description: 'Time delay in data transmission.' },
  {
    english: 'Bandwidth',
    arabic: 'عرض النطاق',
    description: 'Maximum data transfer rate of a network.',
  },
  {
    english: 'Router',
    arabic: 'موجه',
    description: 'Device that directs traffic between networks.',
  },
  { english: 'Switch', arabic: 'مبدل', description: 'Connects devices within a network.' },
  { english: 'Port', arabic: 'منفذ', description: 'Logical endpoint for communication.' },
  { english: 'Protocol', arabic: 'بروتوكول', description: 'Rules governing data communication.' },
  { english: 'IPv4', arabic: 'الإصدار الرابع من IP', description: '32-bit IP addressing system.' },
  { english: 'IPv6', arabic: 'الإصدار السادس من IP', description: '128-bit IP addressing system.' },
  {
    english: 'NAT',
    arabic: 'ترجمة عناوين الشبكة',
    description: 'Maps private IP addresses to public ones.',
  },
  { english: 'Public IP', arabic: 'عنوان IP عام', description: 'Accessible over the internet.' },
  { english: 'Private IP', arabic: 'عنوان IP خاص', description: 'Used within local networks.' },
  { english: 'Ping', arabic: 'اختبار الاتصال', description: 'Tool to test network connectivity.' },
  { english: 'Traceroute', arabic: 'تتبع المسار', description: 'Tracks the path packets take.' },
  {
    english: 'Encryption',
    arabic: 'التشفير',
    description: 'Secures data by converting it into code.',
  },
  {
    english: 'Decryption',
    arabic: 'فك التشفير',
    description: 'Converts encrypted data back to readable form.',
  },
  {
    english: 'Authentication',
    arabic: 'المصادقة',
    description: 'Verifies identity of users or systems.',
  },
  { english: 'Authorization', arabic: 'التفويض', description: 'Determines access permissions.' },
  { english: 'Proxy', arabic: 'وكيل', description: 'Acts as an intermediary for requests.' },
  {
    english: 'Load Balancer',
    arabic: 'موازن الأحمال',
    description: 'Distributes traffic across servers.',
  },
];
export const acronymsData: AcronymData[] = [
  { acronym: 'IP', englishName: 'Internet Protocol', arabicName: 'بروتوكول الإنترنت' },
  { acronym: 'DNS', englishName: 'Domain Name System', arabicName: 'نظام أسماء النطاقات' },
  {
    acronym: 'DHCP',
    englishName: 'Dynamic Host Configuration Protocol',
    arabicName: 'بروتوكول التهيئة التلقائية',
  },
  { acronym: 'VPN', englishName: 'Virtual Private Network', arabicName: 'شبكة افتراضية خاصة' },
  { acronym: 'SSL', englishName: 'Secure Sockets Layer', arabicName: 'طبقة المنافذ الآمنة' },
  { acronym: 'TLS', englishName: 'Transport Layer Security', arabicName: 'أمن طبقة النقل' },
  {
    acronym: 'HTTP',
    englishName: 'HyperText Transfer Protocol',
    arabicName: 'بروتوكول نقل النص الفائق',
  },
  { acronym: 'HTTPS', englishName: 'Secure HTTP', arabicName: 'بروتوكول نقل النص الآمن' },
  { acronym: 'FTP', englishName: 'File Transfer Protocol', arabicName: 'بروتوكول نقل الملفات' },
  { acronym: 'SSH', englishName: 'Secure Shell', arabicName: 'قشرة آمنة' },
  {
    acronym: 'TCP',
    englishName: 'Transmission Control Protocol',
    arabicName: 'بروتوكول التحكم بالنقل',
  },
  { acronym: 'UDP', englishName: 'User Datagram Protocol', arabicName: 'بروتوكول بيانات المستخدم' },
  { acronym: 'MAC', englishName: 'Media Access Control', arabicName: 'التحكم بالوصول إلى الوسائط' },
  { acronym: 'LAN', englishName: 'Local Area Network', arabicName: 'شبكة محلية' },
  { acronym: 'WAN', englishName: 'Wide Area Network', arabicName: 'شبكة واسعة' },
  { acronym: 'NAT', englishName: 'Network Address Translation', arabicName: 'ترجمة عناوين الشبكة' },
  { acronym: 'ISP', englishName: 'Internet Service Provider', arabicName: 'مزود خدمة الإنترنت' },
  {
    acronym: 'ICMP',
    englishName: 'Internet Control Message Protocol',
    arabicName: 'بروتوكول رسائل التحكم',
  },
  {
    acronym: 'ARP',
    englishName: 'Address Resolution Protocol',
    arabicName: 'بروتوكول تحليل العناوين',
  },
  {
    acronym: 'BGP',
    englishName: 'Border Gateway Protocol',
    arabicName: 'بروتوكول البوابة الحدودية',
  },
  { acronym: 'OSPF', englishName: 'Open Shortest Path First', arabicName: 'أقصر مسار أولاً' },
  { acronym: 'QoS', englishName: 'Quality of Service', arabicName: 'جودة الخدمة' },
  { acronym: 'VoIP', englishName: 'Voice over IP', arabicName: 'الصوت عبر IP' },
  {
    acronym: 'API',
    englishName: 'Application Programming Interface',
    arabicName: 'واجهة برمجة التطبيقات',
  },
  { acronym: 'URL', englishName: 'Uniform Resource Locator', arabicName: 'محدد موقع الموارد' },
  { acronym: 'CDN', englishName: 'Content Delivery Network', arabicName: 'شبكة توصيل المحتوى' },
  {
    acronym: 'MFA',
    englishName: 'Multi-Factor Authentication',
    arabicName: 'المصادقة متعددة العوامل',
  },
  { acronym: 'SLA', englishName: 'Service Level Agreement', arabicName: 'اتفاقية مستوى الخدمة' },
  { acronym: 'IDS', englishName: 'Intrusion Detection System', arabicName: 'نظام كشف التسلل' },
  { acronym: 'IPS', englishName: 'Intrusion Prevention System', arabicName: 'نظام منع التسلل' },
  { acronym: 'IP', englishName: 'Internet Protocol', arabicName: 'بروتوكول الإنترنت' },
  { acronym: 'DNS', englishName: 'Domain Name System', arabicName: 'نظام أسماء النطاقات' },
  {
    acronym: 'DHCP',
    englishName: 'Dynamic Host Configuration Protocol',
    arabicName: 'بروتوكول التهيئة التلقائية',
  },
  { acronym: 'VPN', englishName: 'Virtual Private Network', arabicName: 'شبكة افتراضية خاصة' },
  { acronym: 'SSL', englishName: 'Secure Sockets Layer', arabicName: 'طبقة المنافذ الآمنة' },
  { acronym: 'TLS', englishName: 'Transport Layer Security', arabicName: 'أمن طبقة النقل' },
  {
    acronym: 'HTTP',
    englishName: 'HyperText Transfer Protocol',
    arabicName: 'بروتوكول نقل النص الفائق',
  },
  { acronym: 'HTTPS', englishName: 'Secure HTTP', arabicName: 'بروتوكول نقل النص الآمن' },
  { acronym: 'FTP', englishName: 'File Transfer Protocol', arabicName: 'بروتوكول نقل الملفات' },
  { acronym: 'SSH', englishName: 'Secure Shell', arabicName: 'قشرة آمنة' },
  {
    acronym: 'TCP',
    englishName: 'Transmission Control Protocol',
    arabicName: 'بروتوكول التحكم بالنقل',
  },
  { acronym: 'UDP', englishName: 'User Datagram Protocol', arabicName: 'بروتوكول بيانات المستخدم' },
  { acronym: 'MAC', englishName: 'Media Access Control', arabicName: 'التحكم بالوصول إلى الوسائط' },
  { acronym: 'LAN', englishName: 'Local Area Network', arabicName: 'شبكة محلية' },
  { acronym: 'WAN', englishName: 'Wide Area Network', arabicName: 'شبكة واسعة' },
  { acronym: 'NAT', englishName: 'Network Address Translation', arabicName: 'ترجمة عناوين الشبكة' },
  { acronym: 'ISP', englishName: 'Internet Service Provider', arabicName: 'مزود خدمة الإنترنت' },
  {
    acronym: 'ICMP',
    englishName: 'Internet Control Message Protocol',
    arabicName: 'بروتوكول رسائل التحكم',
  },
  {
    acronym: 'ARP',
    englishName: 'Address Resolution Protocol',
    arabicName: 'بروتوكول تحليل العناوين',
  },
  {
    acronym: 'BGP',
    englishName: 'Border Gateway Protocol',
    arabicName: 'بروتوكول البوابة الحدودية',
  },
  { acronym: 'OSPF', englishName: 'Open Shortest Path First', arabicName: 'أقصر مسار أولاً' },
  { acronym: 'QoS', englishName: 'Quality of Service', arabicName: 'جودة الخدمة' },
  { acronym: 'VoIP', englishName: 'Voice over IP', arabicName: 'الصوت عبر IP' },
  {
    acronym: 'API',
    englishName: 'Application Programming Interface',
    arabicName: 'واجهة برمجة التطبيقات',
  },
  { acronym: 'URL', englishName: 'Uniform Resource Locator', arabicName: 'محدد موقع الموارد' },
  { acronym: 'CDN', englishName: 'Content Delivery Network', arabicName: 'شبكة توصيل المحتوى' },
  {
    acronym: 'MFA',
    englishName: 'Multi-Factor Authentication',
    arabicName: 'المصادقة متعددة العوامل',
  },
  { acronym: 'SLA', englishName: 'Service Level Agreement', arabicName: 'اتفاقية مستوى الخدمة' },
  { acronym: 'IDS', englishName: 'Intrusion Detection System', arabicName: 'نظام كشف التسلل' },
  { acronym: 'IPS', englishName: 'Intrusion Prevention System', arabicName: 'نظام منع التسلل' },
];
export const IPGlossarySection: React.FC<IPGlossarySectionProps> = ({
  glossaryTerms,
  acronyms,
}) => {
  const t = useTranslations('ipGlossary');
  const [activeTab, setActiveTab] = useState<'Glossary' | 'Acronyms'>('Glossary');
  const [activeLetter, setActiveLetter] = useState<string>('ALL');

  const [isArabic, setIsArabic] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ARABIC_TOGGLE_STORAGE_KEY);
      return saved === 'true';
    }
    return false;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentLetters = isArabic ? ARABIC_LETTERS : ENGLISH_LETTERS;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ARABIC_TOGGLE_STORAGE_KEY, String(isArabic));
    }
  }, [isArabic]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeLetter, activeTab, searchQuery]);

  const filteredGlossary = glossaryTermsData.filter((entry) => {
    let matchesLetter = true;
    if (activeLetter !== 'ALL') {
      if (isArabic) {
        matchesLetter = entry.arabic.trim().startsWith(activeLetter);
      } else {
        matchesLetter = entry.english.toUpperCase().startsWith(activeLetter);
      }
    }

    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch =
        entry.english.toLowerCase().includes(query) ||
        entry.arabic.includes(query) ||
        entry.description.toLowerCase().includes(query);
    }

    return matchesLetter && matchesSearch;
  });

  const filteredAcronyms = acronymsData.filter((entry) => {
    let matchesLetter = true;
    if (activeLetter !== 'ALL') {
      if (isArabic) {
        matchesLetter = entry.arabicName.trim().startsWith(activeLetter);
      } else {
        matchesLetter =
          entry.englishName.toUpperCase().startsWith(activeLetter) ||
          entry.acronym.toUpperCase().startsWith(activeLetter);
      }
    }

    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch =
        entry.acronym.toLowerCase().includes(query) ||
        entry.englishName.toLowerCase().includes(query) ||
        entry.arabicName.includes(query);
    }

    return matchesLetter && matchesSearch;
  });

  const totalGlossaryPages = Math.ceil(filteredGlossary.length / ITEMS_PER_PAGE);
  const totalAcronymsPages = Math.ceil(filteredAcronyms.length / ITEMS_PER_PAGE);

  const paginatedGlossary = filteredGlossary.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const paginatedAcronyms = filteredAcronyms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleArabicToggle = () => {
    setIsArabic((prev) => !prev);
    setActiveLetter('ALL');
  };

  const handleClearFilters = () => {
    setActiveLetter('ALL');
    setSearchQuery('');
  };

  // Define columns for acronyms table with translations
  const acronymsColumns: TableColumn<AcronymData>[] = [
    {
      key: 'acronym',
      header: t('table.acronym'),
      align: 'left',
    },
    {
      key: 'englishName',
      header: t('table.englishName'),
      align: 'left',
    },
    {
      key: 'arabicName',
      header: t('table.arabicName'),
      align: 'right',
    },
  ];

  // Translated tabs
  const tabLabels = {
    Glossary: t('tabs.glossary'),
    Acronyms: t('tabs.acronyms'),
  };

  return (
    <section className="bg-white py-20">
      <div className="mx-auto box-border flex min-w-0 w-full max-w-[1280px] flex-col gap-6 px-4 xl:px-0">
        <GlossaryTabs
          tabs={['Glossary', 'Acronyms']}
          tabLabels={tabLabels}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'Glossary' | 'Acronyms')}
          indicatorInsetPx={16}
        />

        {activeTab === 'Glossary' && (
          <>
            <LetterFilterGroup
              letters={currentLetters}
              selectedLetter={activeLetter}
              onSelect={(letter) => setActiveLetter(letter)}
              onClear={handleClearFilters}
              isArabic={isArabic}
              onArabicToggle={handleArabicToggle}
              searchQuery={searchQuery}
              onSearchChange={(value) => setSearchQuery(value)}
            />
            <h2 className="text-[48px] leading-[60px] tracking-[-0.96px] font-medium">
              {t('totalNumber')}: {filteredGlossary.length}
            </h2>
            <GlossaryTable data={paginatedGlossary} />
            {totalGlossaryPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalGlossaryPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {activeTab === 'Acronyms' && (
          <>
            <LetterFilterGroup
              letters={currentLetters}
              selectedLetter={activeLetter}
              onSelect={(letter) => setActiveLetter(letter)}
              onClear={handleClearFilters}
              isArabic={isArabic}
              onArabicToggle={handleArabicToggle}
              searchQuery={searchQuery}
              onSearchChange={(value) => setSearchQuery(value)}
            />
            <h2 className="text-[48px] leading-[60px] tracking-[-0.96px] font-medium">
              {t('totalNumber')}: {filteredAcronyms.length}
            </h2>
            <Table columns={acronymsColumns} data={paginatedAcronyms} />
            {totalAcronymsPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalAcronymsPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};
