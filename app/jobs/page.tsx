'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Briefcase, Building2, Calendar, Clock, MapPin, Search, DollarSign, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchJobs } from '@/store/reducers/jobSlice';
import Link from 'next/link';

export default function JobsPage() {
  const dispatch = useAppDispatch();
  const jobs = useAppSelector((state) => state.jobs.items);
  const loading = useAppSelector((state) => state.jobs.loading);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  // Expanded job details
  const [expandedJobs, setExpandedJobs] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter, companyFilter]);

  // Toggle job details expansion
  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all" || !locationFilter ? true : job.jobLocation.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesCompany = companyFilter === "all" || !companyFilter ? true : job.company.toLowerCase().includes(companyFilter.toLowerCase());

    return matchesSearch && matchesLocation && matchesCompany;
  });

  // Get unique locations and companies for filters
  const locations = Array.from(new Set(jobs.map(job => job.jobLocation))).filter(Boolean);
  const companies = Array.from(new Set(jobs.map(job => job.company))).filter(Boolean);

  // Get current jobs for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // Generate page numbers
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pageNumbers = [];

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day';
    return `${diffDays} days`;
  };

  return (
    <>
      <Header />
      <div className="flex w-full justify-center min-h-screen pt-12 p-4">
        <div className="container max-w-6xl py-8 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Job Opportunities</h1>
            <p className="text-muted-foreground">Find your next role in tech</p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company} value={company}>{company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('all');
                  setCompanyFilter('all');
                }} className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Pagination */}
          {totalPages > 1 && (
            <div className="mb-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors'}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === '...' ? (
                        <span className="px-4 py-2 text-muted-foreground">...</span>
                      ) : (
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => typeof page === 'number' && setCurrentPage(page)}
                          className={`cursor-pointer transition-colors ${currentPage === page
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'hover:bg-accent hover:text-accent-foreground'
                            }`}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Job Listings */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : currentJobs.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-xl font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your search filters</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {currentJobs.map((job) => (
                <Card key={job._id} className={`overflow-hidden ${job.isFeatured ? 'border-primary/50 bg-primary/5' : ''}`}>
                  {job.isFeatured && (
                    <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 text-center">
                      Featured Opportunity
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Company Logo/Info */}
                      <div className="md:w-1/4">
                        <div className="flex flex-col items-center md:items-start">
                          <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center mb-3">
                            {job.recruiter?.companyLogo ? (
                              <img
                                src={job.recruiter.companyLogo}
                                alt={job.company}
                                className="max-w-full max-h-full p-2"
                              />
                            ) : (
                              <Building2 className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <h3 className="font-medium">{job.company}</h3>
                          <p className="text-sm text-muted-foreground">{job.recruiter?.name || 'Recruiter'}</p>
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="md:w-3/4">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div>
                            <h2 className="text-xl font-bold mb-1">{job.title}</h2>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {job.jobLocation && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {job.jobLocation}
                                </Badge>
                              )}
                              {job.salary && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {job.salary}
                                </Badge>
                              )}
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Posted {formatDate(job.createdAt)}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <Badge variant={getDaysRemaining(job.deadline) === 'Expired' ? 'destructive' : 'secondary'} className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getDaysRemaining(job.deadline)} {getDaysRemaining(job.deadline) !== 'Expired' && 'remaining'}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-3">{job.description}</p>

                        {/* Expand/Collapse Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleJobExpansion(job._id)}
                          className="mb-4 text-primary hover:text-primary/80 p-0 h-auto font-medium flex items-center gap-1"
                        >
                          {expandedJobs.includes(job._id) ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Show More Details
                            </>
                          )}
                        </Button>

                        {/* Expanded Details */}
                        {expandedJobs.includes(job._id) && (
                          <div className="mt-4 space-y-4 border-t pt-4 animate-in fade-in-50 duration-300">
                            {job.responsibilities && (
                              <div>
                                <h3 className="font-semibold text-sm mb-2 flex items-center">
                                  <Briefcase className="h-4 w-4 mr-2 text-primary" />
                                  Responsibilities
                                </h3>
                                <div className="text-sm text-muted-foreground whitespace-pre-line pl-6">
                                  {job.responsibilities}
                                </div>
                              </div>
                            )}

                            {job.requirements && (
                              <div>
                                <h3 className="font-semibold text-sm mb-2 flex items-center">
                                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                                  Requirements
                                </h3>
                                <div className="text-sm text-muted-foreground whitespace-pre-line pl-6">
                                  {job.requirements}
                                </div>
                              </div>
                            )}

                            {job.howtoapply && (
                              <div>
                                <h3 className="font-semibold text-sm mb-2 flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                                  How to Apply
                                </h3>
                                <div className="text-sm text-muted-foreground whitespace-pre-line pl-6">
                                  {job.howtoapply}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* <div className="flex flex-wrap gap-3 mt-4">
                          <Link href={`/jobs/${job._id}`}>
                            <Button>View Details</Button>
                          </Link>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Apply Now
                          </Button>
                        </div> */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors'}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === '...' ? (
                        <span className="px-4 py-2 text-muted-foreground">...</span>
                      ) : (
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => typeof page === 'number' && setCurrentPage(page)}
                          className={`cursor-pointer transition-colors ${currentPage === page
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'hover:bg-accent hover:text-accent-foreground'
                            }`}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
