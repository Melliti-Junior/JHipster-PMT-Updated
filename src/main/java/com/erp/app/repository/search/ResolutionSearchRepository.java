package com.erp.app.repository.search;

import com.erp.app.domain.Resolution;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Resolution entity.
 */
public interface ResolutionSearchRepository extends ElasticsearchRepository<Resolution, String> {
}
