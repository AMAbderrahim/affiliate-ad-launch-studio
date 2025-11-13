import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaign, Campaign } from '../context/CampaignContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, X } from 'lucide-react';

export function MainDataHub() {
  const navigate = useNavigate();
  const { campaign, setCampaign } = useCampaign();
  
  const [formData, setFormData] = useState<Partial<Campaign>>(campaign || {
    name: '',
    product: {
      name: '',
      price: 0,
      category: '',
      images: [],
      landing_page: '',
      short_desc: ''
    },
    goals: {
      primary_kpi: 'CPA'
    },
    geo: ['US'],
    budget: {
      daily: 1000,
      total: 7000
    },
    traffic_sources: ['facebook'],
    constraints: '',
    brand_requirements: '',
    status: 'draft'
  });

  const [newGeo, setNewGeo] = useState('');
  const [newTrafficSource, setNewTrafficSource] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const campaignData: Campaign = {
      id: campaign?.id || `campaign-${Date.now()}`,
      name: formData.name || 'Untitled Campaign',
      product: formData.product!,
      goals: formData.goals!,
      geo: formData.geo || ['US'],
      budget: formData.budget!,
      traffic_sources: formData.traffic_sources || [],
      constraints: formData.constraints || '',
      brand_requirements: formData.brand_requirements || '',
      created_at: campaign?.created_at || new Date().toISOString(),
      status: 'draft'
    };

    setCampaign(campaignData);
    navigate('/marketing-strategist');
  };

  const updateField = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addGeo = () => {
    if (newGeo && !formData.geo?.includes(newGeo)) {
      updateField('geo', [...(formData.geo || []), newGeo]);
      setNewGeo('');
    }
  };

  const removeGeo = (geo: string) => {
    updateField('geo', formData.geo?.filter(g => g !== geo) || []);
  };

  const addTrafficSource = () => {
    if (newTrafficSource && !formData.traffic_sources?.includes(newTrafficSource)) {
      updateField('traffic_sources', [...(formData.traffic_sources || []), newTrafficSource]);
      setNewTrafficSource('');
    }
  };

  const removeTrafficSource = (source: string) => {
    updateField('traffic_sources', formData.traffic_sources?.filter(s => s !== source) || []);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl mb-3">🎯 Campaign Setup</h2>
        <p className="text-blue-100 text-lg">
          Define your product, goals, and campaign parameters to unlock the AI agent workflow
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Campaign Info */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📋</span>
              </div>
              <span>Campaign Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Input
                id="campaign-name"
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Summer Health Supplement Launch"
                required
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Information */}
        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📦</span>
              </div>
              <span>Product Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  value={formData.product?.name || ''}
                  onChange={(e) => updateField('product.name', e.target.value)}
                  placeholder="Ultimate Digestive Support"
                  required
                />
              </div>
              <div>
                <Label htmlFor="product-price">Price ($)</Label>
                <Input
                  id="product-price"
                  type="number"
                  value={formData.product?.price || 0}
                  onChange={(e) => updateField('product.price', parseFloat(e.target.value) || 0)}
                  placeholder="49.99"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-category">Category</Label>
                <Input
                  id="product-category"
                  value={formData.product?.category || ''}
                  onChange={(e) => updateField('product.category', e.target.value)}
                  placeholder="Health & Wellness"
                  required
                />
              </div>
              <div>
                <Label htmlFor="landing-page">Landing Page URL</Label>
                <Input
                  id="landing-page"
                  type="url"
                  value={formData.product?.landing_page || ''}
                  onChange={(e) => updateField('product.landing_page', e.target.value)}
                  placeholder="https://example.com/product"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="product-description">Product Description</Label>
              <Textarea
                id="product-description"
                value={formData.product?.short_desc || ''}
                onChange={(e) => updateField('product.short_desc', e.target.value)}
                placeholder="A comprehensive digestive health supplement with probiotics, enzymes, and prebiotics..."
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Goals & KPIs */}
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎯</span>
              </div>
              <span>Campaign Goals & Budget</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primary-kpi">Primary KPI</Label>
                <Select 
                  value={formData.goals?.primary_kpi || 'CPA'} 
                  onValueChange={(value) => updateField('goals.primary_kpi', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select KPI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPA">CPA (Cost Per Acquisition)</SelectItem>
                    <SelectItem value="ROAS">ROAS (Return on Ad Spend)</SelectItem>
                    <SelectItem value="ROI">ROI (Return on Investment)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.goals?.primary_kpi === 'CPA' && (
                <div>
                  <Label htmlFor="target-cpa">Target CPA ($)</Label>
                  <Input
                    id="target-cpa"
                    type="number"
                    step="0.01"
                    value={formData.goals?.target_cpa || ''}
                    onChange={(e) => updateField('goals.target_cpa', parseFloat(e.target.value) || 0)}
                    placeholder="12.50"
                  />
                </div>
              )}
              
              {formData.goals?.primary_kpi === 'ROAS' && (
                <div>
                  <Label htmlFor="target-roas">Target ROAS</Label>
                  <Input
                    id="target-roas"
                    type="number"
                    step="0.1"
                    value={formData.goals?.target_roas || ''}
                    onChange={(e) => updateField('goals.target_roas', parseFloat(e.target.value) || 0)}
                    placeholder="2.5"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daily-budget">Daily Budget ($)</Label>
                <Input
                  id="daily-budget"
                  type="number"
                  value={formData.budget?.daily || 0}
                  onChange={(e) => updateField('budget.daily', parseInt(e.target.value) || 0)}
                  placeholder="1000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="total-budget">Total Budget ($)</Label>
                <Input
                  id="total-budget"
                  type="number"
                  value={formData.budget?.total || 0}
                  onChange={(e) => updateField('budget.total', parseInt(e.target.value) || 0)}
                  placeholder="7000"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geography */}
        <Card>
          <CardHeader>
            <CardTitle>Target Geography</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newGeo}
                onChange={(e) => setNewGeo(e.target.value)}
                placeholder="Add country/region (e.g., US, CA, UK)"
              />
              <Button type="button" onClick={addGeo}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.geo?.map((geo) => (
                <Badge key={geo} variant="secondary" className="flex items-center space-x-1">
                  <span>{geo}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeGeo(geo)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Select value={newTrafficSource} onValueChange={setNewTrafficSource}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select traffic source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="native">Native</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              <Button type="button" onClick={addTrafficSource}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.traffic_sources?.map((source) => (
                <Badge key={source} variant="secondary" className="flex items-center space-x-1">
                  <span>{source}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeTrafficSource(source)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Constraints & Brand Requirements */}
        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">⚙️</span>
              </div>
              <span>Additional Requirements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="constraints">Constraints</Label>
              <Textarea
                id="constraints"
                value={formData.constraints || ''}
                onChange={(e) => updateField('constraints', e.target.value)}
                placeholder="No medical claims, no competitor logos, avoid words like 'cure'..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="brand-requirements">Brand Requirements</Label>
              <Textarea
                id="brand-requirements"
                value={formData.brand_requirements || ''}
                onChange={(e) => updateField('brand_requirements', e.target.value)}
                placeholder="Use brand colors (blue #1E40AF), include logo, maintain professional tone..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button 
            type="submit" 
            size="lg" 
            className="px-12 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
          >
            🚀 Launch Campaign Workflow
          </Button>
        </div>
      </form>
    </div>
  );
}