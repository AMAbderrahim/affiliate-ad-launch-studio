import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download, FileText, BarChart3, Target, TrendingUp, Calendar } from 'lucide-react';

export function WeeklyReports() {
  const { campaign } = useCampaign();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (reportType: string) => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    
    // In a real app, this would trigger download
    console.log(`Generated ${reportType} report`);
  };

  // Mock data for demonstration
  const mockData = {
    testMatrix: [
      { cell_id: 'c-001', creative: 'Video A', audience: 'Health Conscious 25-45', cpa: 16.50, conversions: 127, spend: 2095.50, status: 'scaling' },
      { cell_id: 'c-002', creative: 'Static B', audience: 'Health Conscious 25-45', cpa: 23.40, conversions: 89, spend: 2082.60, status: 'monitoring' },
      { cell_id: 'c-003', creative: 'Video A', audience: 'Digestive Health Seekers', cpa: 19.20, conversions: 104, spend: 1996.80, status: 'scaling' },
      { cell_id: 'c-004', creative: 'Carousel C', audience: 'Wellness Enthusiasts', cpa: 28.90, conversions: 67, spend: 1936.30, status: 'paused' }
    ],
    creativeScores: [
      { id: 'Video A', ctr: 2.8, cvr: 3.2, novelty: 8, clarity: 9, relevance: 8, overall: 8.2 },
      { id: 'Static B', ctr: 1.9, cvr: 2.8, novelty: 6, clarity: 8, relevance: 7, overall: 7.0 },
      { id: 'Carousel C', ctr: 2.1, cvr: 2.1, novelty: 7, clarity: 7, relevance: 6, overall: 6.7 },
      { id: 'Video D', ctr: 3.1, cvr: 2.9, novelty: 9, clarity: 8, relevance: 9, overall: 8.6 }
    ],
    compliance: [
      { item: 'Video A - Health Claims', status: 'approved', notes: 'All claims substantiated' },
      { item: 'Static B - Disclaimer', status: 'flagged', notes: 'FDA disclaimer needs larger font' },
      { item: 'Landing Page Copy', status: 'approved', notes: 'Compliant with FTC guidelines' }
    ]
  };

  if (!campaign) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl mb-2">No Campaign Data</h2>
            <p className="text-gray-600 mb-4">
              Create a campaign in the Data Hub to generate weekly reports.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl mb-2">Weekly Campaign Reports</h1>
        <p className="text-gray-600">Automated artifacts and performance analysis for {campaign.name}</p>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Generate Weekly Artifacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => generateReport('test-matrix')}
              disabled={isGenerating}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <Target className="w-6 h-6" />
              <span>Test Matrix</span>
              <span className="text-xs opacity-75">CSV Export</span>
            </Button>
            
            <Button
              onClick={() => generateReport('creative-scorecard')}
              disabled={isGenerating}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <BarChart3 className="w-6 h-6" />
              <span>Creative Scorecard</span>
              <span className="text-xs opacity-75">Performance Analysis</span>
            </Button>
            
            <Button
              onClick={() => generateReport('compliance-report')}
              disabled={isGenerating}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <FileText className="w-6 h-6" />
              <span>Compliance Report</span>
              <span className="text-xs opacity-75">Regulatory Review</span>
            </Button>
            
            <Button
              onClick={() => generateReport('scaling-plan')}
              disabled={isGenerating}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <TrendingUp className="w-6 h-6" />
              <span>Scaling Plan</span>
              <span className="text-xs opacity-75">Next Week Strategy</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="test-matrix" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test-matrix">Test Matrix</TabsTrigger>
          <TabsTrigger value="creative-scorecard">Creative Scorecard</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="scaling">Scaling Plan</TabsTrigger>
        </TabsList>

        {/* Test Matrix */}
        <TabsContent value="test-matrix">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Weekly Test Matrix Results</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">Cell ID</th>
                      <th className="border border-gray-300 p-3 text-left">Creative</th>
                      <th className="border border-gray-300 p-3 text-left">Audience</th>
                      <th className="border border-gray-300 p-3 text-left">CPA</th>
                      <th className="border border-gray-300 p-3 text-left">Conversions</th>
                      <th className="border border-gray-300 p-3 text-left">Spend</th>
                      <th className="border border-gray-300 p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.testMatrix.map((row) => (
                      <tr key={row.cell_id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-3">
                          <Badge variant="outline">{row.cell_id}</Badge>
                        </td>
                        <td className="border border-gray-300 p-3">{row.creative}</td>
                        <td className="border border-gray-300 p-3">{row.audience}</td>
                        <td className="border border-gray-300 p-3">${row.cpa.toFixed(2)}</td>
                        <td className="border border-gray-300 p-3">{row.conversions}</td>
                        <td className="border border-gray-300 p-3">${row.spend.toFixed(2)}</td>
                        <td className="border border-gray-300 p-3">
                          <Badge 
                            variant={
                              row.status === 'scaling' ? 'default' : 
                              row.status === 'monitoring' ? 'secondary' : 'destructive'
                            }
                          >
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <div className="text-sm text-blue-600">Total Spend</div>
                  <div className="text-2xl font-bold text-blue-800">
                    ${mockData.testMatrix.reduce((sum, row) => sum + row.spend, 0).toFixed(2)}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <div className="text-sm text-green-600">Total Conversions</div>
                  <div className="text-2xl font-bold text-green-800">
                    {mockData.testMatrix.reduce((sum, row) => sum + row.conversions, 0)}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <div className="text-sm text-purple-600">Average CPA</div>
                  <div className="text-2xl font-bold text-purple-800">
                    ${(mockData.testMatrix.reduce((sum, row) => sum + row.cpa, 0) / mockData.testMatrix.length).toFixed(2)}
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded">
                  <div className="text-sm text-orange-600">Active Cells</div>
                  <div className="text-2xl font-bold text-orange-800">
                    {mockData.testMatrix.filter(row => row.status !== 'paused').length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creative Scorecard */}
        <TabsContent value="creative-scorecard">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Creative Performance Scorecard</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.creativeScores.map((creative) => (
                  <div key={creative.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">{creative.id}</h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{creative.overall}/10</div>
                        <div className="text-sm text-gray-600">Overall Score</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-medium">{creative.ctr}%</div>
                        <div className="text-sm text-gray-600">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-medium">{creative.cvr}%</div>
                        <div className="text-sm text-gray-600">CVR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-medium">{creative.novelty}/10</div>
                        <div className="text-sm text-gray-600">Novelty</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-medium">{creative.clarity}/10</div>
                        <div className="text-sm text-gray-600">Clarity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-medium">{creative.relevance}/10</div>
                        <div className="text-sm text-gray-600">Relevance</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="mt-6 p-4 bg-blue-50 rounded">
                <h4 className="font-medium mb-2">Creative Recommendations</h4>
                <ul className="text-sm space-y-1">
                  <li>• Scale Video A and Video D - highest performing creatives</li>
                  <li>• Refresh Static B with new hook - CTR below benchmark</li>
                  <li>• Test Carousel C with different audience - poor relevance score</li>
                  <li>• Create 3 new variants based on Video A success pattern</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Compliance Report</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.compliance.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{item.item}</h4>
                      <Badge 
                        variant={item.status === 'approved' ? 'default' : 'destructive'}
                        className="capitalize"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.notes}</p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-green-800">2</div>
                  <div className="text-sm text-green-600">Approved Items</div>
                </div>
                <div className="bg-orange-50 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-orange-800">1</div>
                  <div className="text-sm text-orange-600">Flagged Items</div>
                </div>
                <div className="bg-blue-50 p-4 rounded text-center">
                  <div className="text-2xl font-bold text-blue-800">67%</div>
                  <div className="text-sm text-blue-600">Compliance Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scaling Plan */}
        <TabsContent value="scaling">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Next Week Scaling Plan</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Scaling Recommendations */}
                <div>
                  <h4 className="font-medium mb-3">Recommended Actions</h4>
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 p-3 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">Scale Winners</span>
                      </div>
                      <p className="text-sm">Increase budget for c-001 and c-003 by 50% - both performing 25% under target CPA</p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Test New Variants</span>
                      </div>
                      <p className="text-sm">Launch 3 new video variants based on Video A success pattern with different hooks</p>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <FileText className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-orange-800">Optimize Underperformers</span>
                      </div>
                      <p className="text-sm">Pause c-004, refresh c-002 with new creative angle or audience adjustment</p>
                    </div>
                  </div>
                </div>

                {/* Budget Allocation */}
                <div>
                  <h4 className="font-medium mb-3">Next Week Budget Allocation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>c-001 (Video A + Health Conscious)</span>
                        <span className="font-medium">$150/day (+50%)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>c-003 (Video A + Digestive Health)</span>
                        <span className="font-medium">$125/day (+50%)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>New Video Variants (3x)</span>
                        <span className="font-medium">$200/day (new)</span>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded">
                      <h5 className="font-medium mb-2">Week Summary</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total Daily Budget:</span>
                          <span className="font-medium">$475</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Weekly Budget:</span>
                          <span className="font-medium">$3,325</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected CPA:</span>
                          <span className="font-medium">$18.50</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Metrics */}
                <div>
                  <h4 className="font-medium mb-3">Success Metrics for Next Week</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="font-medium">Target CPA</div>
                      <div className="text-xl font-bold text-green-700">≤ $20.00</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="font-medium">Target Conversions</div>
                      <div className="text-xl font-bold text-blue-700">≥ 180</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="font-medium">New Variant CTR</div>
                      <div className="text-xl font-bold text-purple-700">≥ 2.5%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}