
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Users, Building2, Filter, Search, MapPin } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchContributors } from '@/store/reducers/contributorSlice';
import { fetchRecruiters } from '@/store/reducers/recruiterSlice';
import { fetchQuizScorerList } from '@/store/reducers/quizSlice';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UserListPage() {
  const [activeTab, setActiveTab] = useState('contributors');
  const dispatch = useAppDispatch();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [countryFilter, setCountryFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const contributors = useAppSelector((state) => state.contributors.items);
  const recruiters = useAppSelector((state) => state.recruiters.items);
  const scorers = useAppSelector((state) => state.quizzes.scorers);

  // Get unique countries and companies for filters
  const getUniqueCountries = useCallback(() => {
    if (activeTab === 'contributors') {
      return Array.from(new Set(contributors.map(item => item.country))).filter(Boolean);
    } else if (activeTab === 'recruiters') {
      return Array.from(new Set(recruiters.map(item => item.country))).filter(Boolean);
    } else {
      return Array.from(new Set(scorers.map(item => item.country))).filter(Boolean);
    }
  }, [activeTab, contributors, recruiters, scorers]);

  // Get unique companies for filters
  const getUniqueCompanies = useCallback(() => {
    if (activeTab === 'recruiters') {
      return Array.from(new Set(recruiters.map(item => item.companyName))).filter(Boolean);
    }
    return [];
  }, [activeTab, recruiters]);

  useEffect(() => {
    dispatch(fetchContributors());
    dispatch(fetchRecruiters());
    dispatch(fetchQuizScorerList());
  }, [dispatch]);

  // Reset pagination and filters when changing tabs
  useEffect(() => {
    setCurrentPage(1);
    setCountryFilter('all');
    setCompanyFilter('all');
  }, [activeTab]);

  // Apply filters to the current data
  const getFilteredItems = useCallback(() => {
    let items = [];

    if (activeTab === 'contributors') {
      items = contributors;
    } else if (activeTab === 'recruiters') {
      items = recruiters;
    } else {
      items = scorers;
    }

    // Apply search filter if set
    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply country filter if set and not "all"
    if (countryFilter && countryFilter !== 'all') {
      items = items.filter(item => item.country === countryFilter);
    }

    // Apply company filter if set and not "all" (only for recruiters)
    if (companyFilter && companyFilter !== 'all' && activeTab === 'recruiters') {
      items = items.filter(item => item.companyName === companyFilter);
    }

    return items;
  }, [activeTab, contributors, recruiters, scorers, searchTerm, countryFilter, companyFilter]);

  // Get current items based on pagination and filters
  const getCurrentItems = useCallback(() => {
    const filteredItems = getFilteredItems();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [getFilteredItems, currentPage, itemsPerPage]);

  // Get total pages
  const getTotalPages = useCallback(() => {
    const totalItems = getFilteredItems().length;
    return Math.ceil(totalItems / itemsPerPage);
  }, [getFilteredItems, itemsPerPage]);

  // Generate page numbers
  const getPageNumbers = useCallback(() => {
    const totalPages = getTotalPages();
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
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  }, [getTotalPages, currentPage]);

  // Handle filter clicks
  const handleCountryClick = (country: string) => {
    setCountryFilter(prevFilter => prevFilter === country ? '' : country);
    setCurrentPage(1);
  };

  const handleCompanyClick = (company: string) => {
    setCompanyFilter(prevFilter => prevFilter === company ? '' : company);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCountryFilter('all');
    setCompanyFilter('all');
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <div className="flex w-full justify-center min-h-screen pt-12 p-4">
        <div className="container max-w-6xl py-8 w-full">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl">User Directory</CardTitle>
                <CardDescription>
                  Browse contributors, recruiters, and quiz participants
                </CardDescription>
              </div>

              {/* <div className="flex items-center mt-4 sm:mt-0">
                {(countryFilter || companyFilter) && (
                  <div className="flex items-center mr-2">
                    <Badge variant="outline" className="mr-2">
                      {countryFilter && `Country: ${countryFilter}`}
                      {companyFilter && `Company: ${companyFilter}`}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear
                    </Button>
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {getUniqueCountries().length > 0 && (
                      <>
                        <DropdownMenuItem disabled className="font-semibold">
                          Filter by Country
                        </DropdownMenuItem>
                        {getUniqueCountries().map(country => (
                          <DropdownMenuItem
                            key={country}
                            onClick={() => handleCountryClick(country)}
                            className={countryFilter === country ? "bg-primary/10" : ""}
                          >
                            {country}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}

                    {activeTab === 'recruiters' && getUniqueCompanies().length > 0 && (
                      <>
                        <DropdownMenuItem disabled className="font-semibold mt-2">
                          Filter by Company
                        </DropdownMenuItem>
                        {getUniqueCompanies().map(company => (
                          <DropdownMenuItem
                            key={company}
                            onClick={() => handleCompanyClick(company)}
                            className={companyFilter === company ? "bg-primary/10" : ""}
                          >
                            {company}
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> */}
            </CardHeader>
            <CardContent>
              {/* Add Filter Card */}
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select value={countryFilter} onValueChange={setCountryFilter}>
                        <SelectTrigger className="pl-9">
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Countries</SelectItem>
                          {getUniqueCountries().map((country) => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {activeTab === 'recruiters' && (
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Select value={companyFilter} onValueChange={setCompanyFilter}>
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Company" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Companies</SelectItem>
                            {getUniqueCompanies().map((company) => (
                              <SelectItem key={company} value={company}>{company}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="contributors" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="contributors" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Contributors
                  </TabsTrigger>
                  <TabsTrigger value="recruiters" className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    Recruiters
                  </TabsTrigger>
                  <TabsTrigger value="scorers" className="flex items-center">
                    <Trophy className="h-4 w-4 mr-2" />
                    Quiz Scorers
                  </TabsTrigger>
                </TabsList>

                {/* Top Pagination */}
                {getTotalPages() > 1 && (
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
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))}
                            className={currentPage === getTotalPages() ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}

                <TabsContent value="contributors">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="cursor-pointer hover:text-primary" onClick={() => clearFilters()}>
                          Country
                        </TableHead>
                        <TableHead>Contributions</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentItems().map((contributor) => (
                        <TableRow key={contributor._id}>
                          <TableCell className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{contributor.name}</span>
                          </TableCell>
                          <TableCell
                            className="cursor-pointer hover:text-primary hover:underline"
                            onClick={() => handleCountryClick(contributor.country)}
                          >
                            {contributor.country || 'Unknown'}
                          </TableCell>
                          <TableCell>{contributor.contributions?.length || 0}</TableCell>
                          <TableCell>
                            {contributor.verified && (
                              <Badge variant="outline">Verified</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="recruiters">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="cursor-pointer hover:text-primary" onClick={() => clearFilters()}>
                          Company
                        </TableHead>
                        <TableHead className="cursor-pointer hover:text-primary" onClick={() => clearFilters()}>
                          Country
                        </TableHead>
                        <TableHead>Positions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentItems().map((recruiter) => (
                        <TableRow key={recruiter._id}>
                          <TableCell className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{recruiter.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{recruiter.name}</span>
                          </TableCell>
                          <TableCell
                            className="cursor-pointer hover:text-primary hover:underline"
                            onClick={() => handleCompanyClick(recruiter.companyName)}
                          >
                            {recruiter.companyName}
                          </TableCell>
                          <TableCell
                            className="cursor-pointer hover:text-primary hover:underline"
                            onClick={() => handleCountryClick(recruiter.country)}
                          >
                            {recruiter.country}
                          </TableCell>
                          <TableCell>{recruiter.positions?.length || 0}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="scorers">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="cursor-pointer hover:text-primary" onClick={() => clearFilters()}>
                          Country
                        </TableHead>
                        <TableHead>Quiz Score</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentItems().map((scorer) => (
                        <TableRow key={scorer._id}>
                          <TableCell className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{scorer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{scorer.name}</span>
                          </TableCell>
                          <TableCell
                            className="cursor-pointer hover:text-primary hover:underline"
                            onClick={() => handleCountryClick(scorer.country)}
                          >
                            {scorer.country || 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              <span>{scorer.quizScore || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {scorer.verified && (
                              <Badge variant="outline">Verified</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Bottom Pagination */}
                {getTotalPages() > 1 && (
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
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, getTotalPages()))}
                            className={currentPage === getTotalPages() ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}

