package com.erp.app.repository.search.custom;

import com.erp.app.domain.custom.TransitionCustom;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Epic entity.
 */

public interface TransitionCustomSearchRepository extends  ElasticsearchRepository<TransitionCustom, String> {
}
